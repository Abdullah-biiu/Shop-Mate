import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: [],
  },

  reducers: {
    addToCart(state, action) {
      const { product, quantity } = action.payload;

      const existingItem = state.cart.find(
        (item) =>
          (item.product._id || item.product.id) ===
          (product._id || product.id)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          product,
          quantity,
        });
      }
    },

    removeFromCart(state, action) {
      const { id } = action.payload;

      state.cart = state.cart.filter(
        (item) =>
          (item.product._id || item.product.id) !== id
      );
    },

    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;

      const item = state.cart.find(
        (item) =>
          (item.product._id || item.product.id) === id
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;