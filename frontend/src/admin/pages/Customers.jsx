import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Users } from "lucide-react";
import {
  fetchCustomers,
  deleteCustomer,
} from "../../store/slices/customerSlice";

const Customers = () => {
  const dispatch = useDispatch();

  const {
    customers,
    loading,
    totalUsers,
    currentPage,
  } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomers(1));
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    dispatch(deleteCustomer(id));
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Customers
          </h1>

          <p className="text-slate-400 mt-2">
            Total Customers : {totalUsers}
          </p>

        </div>

        <div className="bg-indigo-600 p-4 rounded-xl">

          <Users size={28} />

        </div>

      </div>

      {/* Table */}

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="text-left p-4">Avatar</th>

              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Phone</th>

              <th className="text-left p-4">Joined</th>

              <th className="text-center p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-400"
                >
                  Loading customers...
                </td>

              </tr>

            ) : customers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-400"
                >
                  No Customers Found
                </td>

              </tr>

            ) : (

              customers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                >

                  <td className="p-4">

                    <img
                      src={
                        customer.avatar?.url ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(customer.name)
                      }
                      alt={customer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                  </td>

                  <td className="p-4 text-white">
                    {customer.name}
                  </td>

                  <td className="p-4">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center">

                      <button
                        onClick={() =>
                          handleDelete(customer.id)
                        }
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {totalUsers > 10 && (

        <div className="flex justify-center gap-3">

          {Array.from({
            length: Math.ceil(totalUsers / 10),
          }).map((_, index) => (

            <button
              key={index}
              onClick={() =>
                dispatch(fetchCustomers(index + 1))
              }
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-indigo-600"
                  : "bg-slate-800"
              }`}
            >
              {index + 1}
            </button>

          ))}

        </div>

      )}

    </div>
  );
};

export default Customers;