import { useEffect, useState } from "react";
import {
  Package,
  Filter,
  Loader,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const { myOrders, fetchingOrders } =
    useSelector((state) => state.order);

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const statuses = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders =
    statusFilter === "All"
      ? myOrders
      : myOrders.filter(
          (order) =>
            order.orderStatus === statusFilter
        );

  if (fetchingOrders) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            My Orders
          </h1>

          <p className="text-muted-foreground mt-2">
            Track and manage your order history.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="glass-panel p-4 rounded-xl mb-8">
          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filter by status:</span>
            </div>

            {statuses.map((status) => (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(status)
                }
                className={`px-4 py-2 rounded-lg transition ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "glass-card"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 ? (
          <div className="flex justify-center mt-20">

            <div className="glass-panel p-10 rounded-xl text-center w-[350px]">

              <Package
                className="mx-auto mb-4 text-muted-foreground"
                size={60}
              />

              <h3 className="text-2xl font-semibold mb-2">
                No Orders Found
              </h3>

              <p className="text-muted-foreground">
                You haven't placed any orders yet.
              </p>

            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="glass-panel p-6 rounded-xl"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* ORDER INFO */}
                  <div>
                    <h3 className="font-bold text-lg">
                      Order #
                      {order._id.slice(-8)}
                    </h3>

                    <p className="text-muted-foreground">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.orderStatus ===
                        "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.orderStatus ===
                            "Processing"
                          ? "bg-blue-500/20 text-blue-400"
                          : order.orderStatus ===
                            "Shipped"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div>
                    <h2 className="text-2xl font-bold">
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString()}
                    </h2>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="mt-6 space-y-4">

                  {order.orderItems?.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            item.product?.images?.[0]
                              ?.url
                          }
                          alt={
                            item.product?.name
                          }
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div>
                          <h4 className="font-medium">
                            {
                              item.product?.name
                            }
                          </h4>

                          <p className="text-muted-foreground">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;