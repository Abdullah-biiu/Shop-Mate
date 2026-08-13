import {
  Trash2,
  CheckCircle,
  Pencil,
} from "lucide-react";

const AddressCard = ({
  address,
  onDelete,
  onDefault,
  onEdit,
  selectedAddress,
  onSelect,
}) => {
  return (
    <div
      className={`glass-panel p-5 rounded-xl border transition ${
        selectedAddress === address.id
          ? "border-indigo-500"
          : "border-gray-700"
      }`}
    >
      <div className="flex justify-between gap-6">

        {/* Left Side */}
        <div className="flex gap-4 flex-1">

          <input
            type="radio"
            checked={selectedAddress === address.id}
            onChange={() => onSelect(address)}
            className="mt-2"
          />

          <div className="flex-1">

            <div className="flex items-center gap-3 flex-wrap">

              <h3 className="font-bold text-lg">
                {address.full_name}
              </h3>

              {address.is_default && (
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                  Default
                </span>
              )}

              {address.is_temporary && (
                <span className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full">
                  Temporary
                </span>
              )}

            </div>

            <p className="mt-1">
              {address.phone}
            </p>

            <p className="mt-2">
              {address.address_line1}
            </p>

            {address.address_line2 && (
              <p>{address.address_line2}</p>
            )}

            <p>
              {address.city}, {address.state}
            </p>

            <p>
              {address.country} - {address.pincode}
            </p>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-2">

          {!address.is_default && (
            <button
              onClick={() => onDefault(address.id)}
              className="bg-green-600 hover:bg-green-700 p-2 rounded transition"
              title="Make Default"
            >
              <CheckCircle size={18} />
            </button>
          )}

          <button
            onClick={() => onEdit(address)}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
            title="Edit Address"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(address.id)}
            className="bg-red-600 hover:bg-red-700 p-2 rounded transition"
            title="Delete Address"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddressCard;