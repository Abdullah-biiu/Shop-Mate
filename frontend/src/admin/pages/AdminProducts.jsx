import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fetchAllProducts } from "../../store/slices/productSlice";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();

  const { products, fetchingProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: "",
        price: "0-100000",
        search: "",
        rating: "",
        availability: "",
        page: 1,
      })
    );
  }, [dispatch]);
const handleDelete = async (id) => {
  console.log("DELETE CLICKED", id);

  const confirmDelete = window.confirm(
    "Are you sure?"
  );

  if (!confirmDelete) return;

  try {
    await axiosInstance.delete(`/product/admin/delete/${id}`);

    toast.success("Deleted");
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold text-white">
          Products
        </h1>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-4 text-left">Image</th>

              <th className="p-4 text-left">Product</th>

              <th className="p-4 text-left">Category</th>

              <th className="p-4 text-left">Price</th>

              <th className="p-4 text-left">Stock</th>

              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {!fetchingProducts &&
              products?.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-4">

                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                  </td>

                  <td className="p-4">{product.name}</td>

                  <td className="p-4">{product.category}</td>

                  <td className="p-4">${product.price}</td>

                  <td className="p-4">{product.stock}</td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="bg-indigo-600 p-2 rounded-lg"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
  onClick={() => handleDelete(product.id)}
  className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
>
  <Trash2 size={18} />
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

export default Products;