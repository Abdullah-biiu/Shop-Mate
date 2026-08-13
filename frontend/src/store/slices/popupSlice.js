import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",

  initialState: {
    isAuthPopupOpen: false,
    isMenuOpen: false,
    isProfileOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
  },

  reducers: {
    toggleAuthPopup(state) {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },

    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },

    toggleProfile(state) {
      state.isProfileOpen = !state.isProfileOpen;
    },

    toggleSearchBar(state) {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },

    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    toggleAIModal(state) {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },

    closeAllPopups(state) {
      state.isAuthPopupOpen = false;
      state.isMenuOpen = false;
      state.isProfileOpen = false;
      state.isSearchBarOpen = false;
      state.isCartOpen = false;
      state.isAIPopupOpen = false;
    },
  },
});

export const {
  toggleAuthPopup,
  toggleMenu,
  toggleProfile,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
  closeAllPopups,
} = popupSlice.actions;

export default popupSlice.reducer;