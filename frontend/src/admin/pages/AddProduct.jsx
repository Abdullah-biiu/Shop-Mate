import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  Upload,
  Save,
  ArrowLeft,
  X,
} from "lucide-react";
import { categories } from "../../data/products";

// ₹85 = $1
const INR_TO_USD = 85;

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreview = [...previewImages];

    updatedImages.splice(index, 1);
    updatedPreview.splice(index, 1);

    setImages(updatedImages);
    setPreviewImages(updatedPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      return toast.error("Please fill all fields.");
    }

    if (images.length === 0) {
      return toast.error("Please upload product images.");
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);

      // Convert ₹ → $ → cents
      const usdPrice =
        Number(formData.price) / INR_TO_USD;

      data.append(
        "price",
        Math.round(usdPrice * 100)
      );

      data.append("stock", formData.stock);

      images.forEach((img) => {
        data.append("images", img);
      });

      await axiosInstance.post(
        "/product/admin/create",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (<div className="max-w-6xl mx-auto">

  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 text-slate-300 hover:text-white mb-8"
  >
    <ArrowLeft size={18} />
    Back
  </button>

  <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">

    <div className="p-6 border-b border-slate-800">
      <h1 className="text-3xl font-bold text-white">
        Add Product
      </h1>
    </div>

    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-8"
    >

      {/* Product Name */}

      <div>

        <label className="block mb-2 text-white">
          Product Name
        </label>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
        />

      </div>

      {/* Description */}

      <div>

        <label className="block mb-2 text-white">
          Description
        </label>

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white resize-none"
        />

      </div>

      {/* Category Price Stock */}

      <div className="grid md:grid-cols-3 gap-6">

        <div>

          <label className="block mb-2 text-white">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
          >

            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.icon} {category.name}
              </option>
            ))}

          </select>

        </div>

        {/* PRICE */}

        <div>

          <label className="block mb-2 text-white">
            Price (₹)
          </label>

          <input
            type="number"
            min="1"
            name="price"
            placeholder="Enter price in Rupees"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
          />

          {formData.price && (
            <p className="mt-2 text-sm text-green-400">
              Customer will see:
              <span className="font-semibold ml-1">
                $
                {(Number(formData.price) / INR_TO_USD).toFixed(2)}
              </span>
            </p>
          )}

        </div>

        {/* STOCK */}

        <div>

          <label className="block mb-2 text-white">
            Stock
          </label>

          <input
            type="number"
            min="0"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
          />

        </div>

      </div>

      {/* Images */}

      <div>

        <label className="block mb-4 text-white">
          Product Images
        </label>

        <label className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:border-indigo-500 transition">

          <Upload className="w-10 h-10 text-indigo-500 mb-3" />

          <p className="text-slate-400">
            Click to upload images
          </p>

          <input
            type="file"
            multiple
            hidden
            onChange={handleImages}
          />

        </label>

      </div>

      {previewImages.length > 0 && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {previewImages.map((image, index) => (

            <div
              key={index}
              className="relative"
            >

              <img
                src={image}
                alt=""
                className="rounded-xl h-40 w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  removeImage(index)
                }
                className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
              >
                <X size={16} />
              </button>

            </div>

          ))}

        </div>

      )}

      <button
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl flex items-center gap-2 disabled:opacity-50"
      >

        <Save size={18} />

        {loading
          ? "Creating..."
          : "Create Product"}

      </button>

    </form>

  </div>

</div>
  );
};

export default AddProduct;