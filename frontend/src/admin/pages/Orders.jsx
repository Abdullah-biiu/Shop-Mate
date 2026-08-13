import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      setOrders(data.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/orders/${id}`, {
        order_status: status,
      });

      toast.success("Order updated.");

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          Orders
        </h1>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-slate-400"
                >
                  No Orders Found
                </td>
              </tr>
            )}

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t border-slate-800"
              >

                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customer_name}
                </td>

                <td className="p-4">
                  ${order.total_price}
                </td>

                <td className="p-4">

                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="bg-slate-800 rounded-lg p-2"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td className="p-4">
                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex justify-center">

                    <button className="bg-indigo-600 p-2 rounded-lg">
                      <Eye size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Orders;