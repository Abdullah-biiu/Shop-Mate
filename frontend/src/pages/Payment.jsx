import { useSelector } from "react-redux";

const Payment = () => {
  const { cart } = useSelector((state) => state.cart);
  const { addresses } = useSelector((state) => state.address);

  // Selected Address
  const selectedAddress =
    addresses.find((a) => a.is_default) || addresses[0];

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleWhatsAppOrder = () => {
    const phoneNumber = "918009052311";

    let message = "🛒 *NEW ORDER*%0A%0A";

    // ======================
    // CUSTOMER ADDRESS
    // ======================

    if (selectedAddress) {
      message += "📍 *Delivery Address*%0A";

      message +=
        "Name: " +
        selectedAddress.full_name +
        "%0A";

      message +=
        "Phone: " +
        selectedAddress.phone +
        "%0A";

      message +=
        selectedAddress.address_line1 +
        "%0A";

      if (selectedAddress.address_line2) {
        message +=
          selectedAddress.address_line2 +
          "%0A";
      }

      message +=
        selectedAddress.city +
        ", " +
        selectedAddress.state +
        "%0A";

      message +=
        selectedAddress.country +
        " - " +
        selectedAddress.pincode +
        "%0A%0A";
    }

    // ======================
    // PRODUCTS
    // ======================

    message += "🛍️ *Products*%0A%0A";

    cart.forEach((item, index) => {
      message +=
        index +
        1 +
        ". " +
        item.product.name +
        "%0A";

      message +=
        "Qty : " +
        item.quantity +
        "%0A";

      message +=
        "Price : $" +
        item.product.price +
        "%0A";

      message +=
        "Subtotal : $" +
        (
          item.product.price *
          item.quantity
        ).toFixed(2) +
        "%0A%0A";
    });

    message +=
      "💰 *Total : $" +
      total.toFixed(2) +
      "*%0A%0A";

    message +=
      "Please confirm my order.";

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">

        <div className="max-w-3xl mx-auto glass-panel rounded-xl p-8">

          <h1 className="text-4xl font-bold mb-8">
            Checkout
          </h1>

          {/* Address */}

          <div className="mb-8">

            <h2 className="text-2xl font-semibold mb-4">
              Delivery Address
            </h2>

            {selectedAddress ? (
              <div className="border border-slate-700 rounded-xl p-5">

                <h3 className="font-bold text-lg">
                  {selectedAddress.full_name}
                </h3>

                <p>{selectedAddress.phone}</p>

                <p className="mt-2">
                  {selectedAddress.address_line1}
                </p>

                {selectedAddress.address_line2 && (
                  <p>
                    {selectedAddress.address_line2}
                  </p>
                )}

                <p>
                  {selectedAddress.city},{" "}
                  {selectedAddress.state}
                </p>

                <p>
                  {selectedAddress.country} -{" "}
                  {selectedAddress.pincode}
                </p>

              </div>
            ) : (
              <div className="text-red-500">
                No address selected.
              </div>
            )}

          </div>

          {/* Products */}

          <h2 className="text-2xl font-semibold mb-4">
            Order Items
          </h2>

          <div className="space-y-4">

            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between border-b border-slate-700 pb-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.product.name}
                  </h3>

                  <p>
                    Qty : {item.quantity}
                  </p>
                </div>

                <div>
                  $
                  {(
                    item.product.price *
                    item.quantity
                  ).toFixed(2)}
                </div>

              </div>
            ))}

          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">

            <div className="flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span>
                ${total.toFixed(2)}
              </span>

            </div>

          </div>

          <button
            onClick={handleWhatsAppOrder}
            disabled={!selectedAddress}
            className="
              w-full
              mt-8
              py-4
              rounded-xl
              text-white
              font-semibold
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-500
            "
          >
            Place Order via WhatsApp
          </button>

        </div>

      </div>
    </div>
  );
};

export default Payment;