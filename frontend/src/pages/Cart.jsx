import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Edit,
  MapPin,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateCartQuantity,
} from "../store/slices/cartSlice";

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  selectAddress,
  setEditingAddress,
  clearEditingAddress,
} from "../store/slices/addressSlice";

import AddressForm from "../components/address/AddressForm";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const {
    addresses,
    selectedAddress,
    editingAddress,
  } = useSelector((state) => state.address);


  const [showAddressForm, setShowAddressForm] = useState(false);

  // Temporary address used only for current order
  const [useTemporaryAddress, setUseTemporaryAddress] =
    useState(false);

  const [temporaryAddress, setTemporaryAddress] =
    useState({
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });


  useEffect(() => {
    if (authUser) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, authUser]);


  // ================= CART FUNCTIONS =================

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart({ id }));
    } else {
      dispatch(
        updateCartQuantity({
          id,
          quantity,
        })
      );
    }
  };


  // ================= ADDRESS FUNCTIONS =================

  const handleAddAddress = (data) => {
    dispatch(addAddress(data));
    setShowAddressForm(false);
  };


const handleUpdateAddress = (data) => {
  dispatch(
    updateAddress({
      ...data,
      id: editingAddress.id,
    })
  );

  dispatch(clearEditingAddress());

  setShowAddressModal(false);
  setShowAddressForm(false);
};


  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id));
  };


  const handleEditAddress = (address) => {
  dispatch(setEditingAddress(address));
  setShowAddressModal(true);
};


  const handleSelectAddress = (address) => {
    setUseTemporaryAddress(false);
    dispatch(selectAddress(address));
  };


  const handleDefaultAddress = (id) => {
    dispatch(setDefaultAddress(id));
  };


  // ================= TEMP ADDRESS =================

  const handleTemporaryChange = (e) => {
    setTemporaryAddress({
      ...temporaryAddress,
      [e.target.name]: e.target.value,
    });
  };


  const checkoutAddress = useTemporaryAddress
    ? temporaryAddress
    : selectedAddress;



  // ================= TOTAL =================

  const total = cart?.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );
const [showAddressModal, setShowAddressModal] = useState(false);

  const cartItemsCount = cart?.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );


  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">

        <div className="glass-panel p-10 rounded-xl text-center max-w-md">

          <h1 className="text-3xl font-bold mb-4">
            Your Cart Is Empty
          </h1>

          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Continue Shopping
            <ArrowRight size={18}/>
          </Link>

        </div>

      </div>
    );
  }



  return (
    <div className="min-h-screen pt-24">

      <div className="container mx-auto px-4">


        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">
            Shopping Cart
          </h1>

          <span className="text-muted-foreground">
            {cartItemsCount} Items
          </span>

        </div>



        <div className="grid lg:grid-cols-3 gap-8">


          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-6">


            {cart.map((item)=>(

              <div
                key={
                  item.product._id ||
                  item.product.id
                }
                className="glass-panel p-5 rounded-xl flex gap-4"
              >

                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    item.product?.image?.[0]?.url
                  }
                  alt={item.product.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />


                <div className="flex-1">

                  <h2 className="text-xl font-semibold">
                    {item.product.name}
                  </h2>


                  <p className="text-primary text-2xl font-bold mt-2">
                    $
                    {Number(
                      item.product.price
                    ).toLocaleString("en-US")}
                  </p>


                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id ||
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      className="p-2 border rounded-lg"
                    >
                      <Minus size={16}/>
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id ||
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      className="p-2 border rounded-lg"
                    >
                      <Plus size={16}/>
                    </button>

                  </div>

                </div>


                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        id:
                        item.product._id ||
                        item.product.id,
                      })
                    )
                  }
                  className="text-red-500"
                >
                  <Trash2/>
                </button>


              </div>

            ))}            {/* ================= ADDRESS SECTION ================= */}


            <div className="glass-panel p-6 rounded-xl">


              <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-bold">
                  Delivery Address
                </h2>


                <button
                  onClick={() => {
                    setShowAddressForm(!showAddressForm);

                    if (editingAddress) {
                      dispatch(clearEditingAddress());
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >

                  {showAddressForm ? (
                    <>
                      <X size={18}/>
                      Close
                    </>
                  ) : (
                    <>
                      <Plus size={18}/>
                      Add Address
                    </>
                  )}

                </button>

              </div>



              {/* ADD / EDIT ADDRESS FORM */}

              {showAddressForm && !editingAddress && (

  <div className="mb-6">

    <AddressForm
      onSubmit={handleAddAddress}
      onCancelEdit={() => {
        setShowAddressForm(false);
      }}
    />

  </div>

)}




              {/* TEMPORARY ADDRESS */}

              <div className="border rounded-xl p-4 mb-5">


                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={useTemporaryAddress}
                    onChange={(e)=>{

                      setUseTemporaryAddress(
                        e.target.checked
                      );

                      if(e.target.checked){
                        dispatch(selectAddress(null));
                      }

                    }}
                  />


                  <span className="font-semibold">
                    Use temporary address for this order
                  </span>


                </label>



                <p className="text-sm text-gray-400 mt-2">
                  This address will only be used for this purchase and will not be saved.
                </p>


              </div>





              {/* TEMP ADDRESS FORM */}


              {useTemporaryAddress && (

                <div className="space-y-3 border rounded-xl p-5 mb-5">


                  <h3 className="text-xl font-semibold">
                    Temporary Address
                  </h3>


                  {Object.keys(temporaryAddress).map((field)=>(

                    <input

                      key={field}

                      name={field}

                      value={
                        temporaryAddress[field]
                      }

                      onChange={
                        handleTemporaryChange
                      }

                      placeholder={
                        field
                          .replaceAll("_"," ")
                          .toUpperCase()
                      }

                      className="w-full p-3 rounded-lg bg-slate-800 border"

                    />

                  ))}


                </div>

              )}







              {/* SAVED ADDRESSES */}


              {!useTemporaryAddress && (

                <div className="space-y-4">


                  <h3 className="text-xl font-semibold">
                    Saved Addresses
                  </h3>



                  {addresses?.length > 0 ? (

                    addresses.map((address)=>(


                      <div

                        key={address.id}

                        className={`border rounded-xl p-5 cursor-pointer transition ${
                          selectedAddress?.id === address.id
                          ? "border-primary"
                          : ""
                        }`}

                      >


                        <div className="flex gap-3">


                          <input

                            type="radio"

                            checked={
                              selectedAddress?.id === address.id
                            }

                            onChange={() =>
                              handleSelectAddress(address)
                            }

                          />



                          <div className="flex-1">


                            <div className="flex justify-between">


                              <div>


                                <h4 className="font-bold text-lg">
                                  {address.full_name}
                                </h4>


                                <p>
                                  {address.phone}
                                </p>


                                <p>
                                  {address.address_line1}
                                </p>


                                {
                                  address.address_line2 &&
                                  <p>
                                    {address.address_line2}
                                  </p>
                                }


                                <p>
                                  {address.city},
                                  {" "}
                                  {address.state}
                                </p>


                                <p>
                                  {address.country}
                                  {" - "}
                                  {address.pincode}
                                </p>


                              </div>




                              {address.is_default && (

                                <span className="text-sm text-primary">
                                  Default
                                </span>

                              )}



                            </div>



                            <div className="flex gap-3 mt-4">


                              <button

                                onClick={() =>
                                  handleEditAddress(address)
                                }

                                className="flex items-center gap-1 px-3 py-2 border rounded-lg"

                              >

                                <Edit size={15}/>
                                Edit

                              </button>



                              {!address.is_default && (

                                <button

                                  onClick={() =>
                                    handleDefaultAddress(
                                      address.id
                                    )
                                  }

                                  className="px-3 py-2 border rounded-lg"

                                >

                                  Make Default

                                </button>

                              )}



                              <button

                                onClick={() =>
                                  handleDeleteAddress(
                                    address.id
                                  )
                                }

                                className="px-3 py-2 text-red-500 border rounded-lg"

                              >

                                Delete

                              </button>



                            </div>



                          </div>


                        </div>


                      </div>


                    ))


                  ) : (

                    <p className="text-gray-400">
                      No saved addresses found.
                    </p>

                  )}



                </div>

              )}



            </div>



          </div>





          {/* ================= RIGHT SIDE ================= */}


          <div>


            <div className="glass-panel p-6 rounded-xl sticky top-28">


              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>



              <div className="space-y-4">


                <div className="flex justify-between">

                  <span>
                    Items
                  </span>

                  <span>
                    {cartItemsCount}
                  </span>

                </div>



                <div className="flex justify-between">

                  <span>
                    Shipping
                  </span>

                  <span>
                    Free
                  </span>

                </div>


                <hr/>


                <div className="flex justify-between text-xl font-bold">

                  <span>
                    Total
                  </span>


                  <span>
                    $
                    {Number(total)
                      .toLocaleString("en-US")}
                  </span>


                </div>


              </div>





              {/* SELECTED ADDRESS PREVIEW */}


              <div className="mt-8">


                <h3 className="font-semibold text-lg mb-3">

                  Delivery To

                </h3>



                {checkoutAddress ? (

                  <div className="bg-slate-800 rounded-xl p-4">


                    <p className="font-bold">
                      {checkoutAddress.full_name}
                    </p>


                    <p>
                      {checkoutAddress.phone}
                    </p>


                    <p>
                      {checkoutAddress.address_line1}
                    </p>


                    <p>
                      {checkoutAddress.city},
                      {" "}
                      {checkoutAddress.state}
                    </p>


                    <p>
                      {checkoutAddress.country}
                      {" - "}
                      {checkoutAddress.pincode}
                    </p>


                  </div>


                ) : (


                  <div className="bg-red-500/10 border border-red-500 p-4 rounded-xl">

                    <p className="text-red-400">

                      Please select an address.

                    </p>

                  </div>


                )}


              </div>





              {authUser ? (


                <Link

                  to="/payment"

                  state={{
                    address: checkoutAddress,
                  }}

                  className={`mt-6 w-full flex justify-center items-center gap-2 py-4 rounded-lg font-semibold ${
                    checkoutAddress
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-600 pointer-events-none"
                  }`}

                >

                  Checkout

                  <ArrowRight size={18}/>

                </Link>



              ) : (


                <Link

                  to="/login"

                  className="mt-6 w-full flex justify-center py-4 rounded-lg bg-primary text-white"

                >

                  Login To Checkout

                </Link>


              )}



            </div>


          </div>



        </div>
      </div>

      {/* ================= EDIT ADDRESS MODAL ================= */}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">

              <div>
                <h2 className="text-2xl font-bold">
                  Edit Address
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Update your delivery address.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddressModal(false);
                  dispatch(clearEditingAddress());
                }}
                className="p-2 rounded-lg hover:bg-slate-800"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}
            <div className="p-6">

              <AddressForm
                editingAddress={editingAddress}
                onSubmit={handleUpdateAddress}
                onCancelEdit={() => {
                  setShowAddressModal(false);
                  dispatch(clearEditingAddress());
                }}
              />

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;

     