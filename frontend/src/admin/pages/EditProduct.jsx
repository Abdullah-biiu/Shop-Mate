import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { Save, ArrowLeft } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/product/singleProduct/${id}`
      );

      const product = data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price * 100,
        stock: product.stock,
      });

      setImages(product.images || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      newImages.forEach((image) => {
        data.append("images", image);
      });

      await axiosInstance.put(
        `/product/admin/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product updated successfully.");

      navigate("/admin/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-white text-xl">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-300 hover:text-white mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">

        <div className="border-b border-slate-800 p-6">
          <h1 className="text-3xl font-bold text-white">
            Edit Product
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >

          <div>

            <label className="text-white mb-2 block">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
            />

          </div>

          <div>

            <label className="text-white mb-2 block">
              Description
            </label>

            <textarea
              rows="6"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white resize-none"
            />

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div>

              <label className="text-white mb-2 block">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
              />

            </div>

            <div>

              <label className="text-white mb-2 block">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
              />

            </div>

            <div>

              <label className="text-white mb-2 block">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
              />

            </div>

          </div>

          <div>

            <label className="text-white mb-4 block">
              Current Images
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className="rounded-xl h-36 object-cover w-full border border-slate-700"
                />
              ))}

            </div>

          </div>

          <div>

            <label className="text-white mb-2 block">
              Replace Images
            </label>

            <input
              type="file"
              multiple
              onChange={handleImages}
              className="text-white"
            />

          </div>

          <button
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 py-4 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />

            {saving ? "Updating..." : "Update Product"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProduct;