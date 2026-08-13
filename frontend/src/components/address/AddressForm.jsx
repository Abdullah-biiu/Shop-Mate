import { useEffect, useState } from "react";

const initialState = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  is_temporary: false,
};

const AddressForm = ({
  onSubmit,
  editingAddress = null,
  onCancelEdit,
}) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingAddress) {
      setForm({
        full_name: editingAddress.full_name || "",
        phone: editingAddress.phone || "",
        address_line1: editingAddress.address_line1 || "",
        address_line2: editingAddress.address_line2 || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        country: editingAddress.country || "",
        pincode: editingAddress.pincode || "",
        is_temporary: editingAddress.is_temporary || false,
      });
    } else {
      setForm(initialState);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.full_name ||
      !form.phone ||
      !form.address_line1 ||
      !form.city ||
      !form.state ||
      !form.country ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingAddress) {
      onSubmit({
        ...form,
        id: editingAddress.id,
      });
    } else {
      onSubmit(form);
    }

    setForm(initialState);
  };

  return (
    <form
      onSubmit={submit}
      className="glass-panel p-6 rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {editingAddress ? "Edit Address" : "Add New Address"}
      </h2>

      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={form.full_name}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800"
        required
      />

      <textarea
        rows="2"
        name="address_line1"
        placeholder="House No., Building, Apartment"
        value={form.address_line1}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 resize-none"
        required
      />

      <textarea
        rows="2"
        name="address_line2"
        placeholder="Street, Area, Landmark (Optional)"
        value={form.address_line2}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 resize-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800"
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_temporary"
          name="is_temporary"
          checked={form.is_temporary}
          onChange={handleChange}
        />

        <label htmlFor="is_temporary" className="cursor-pointer">
          Temporary Address (Use only for this order)
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition"
        >
          {editingAddress ? "Update Address" : "Save Address"}
        </button>

        {editingAddress && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;