import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit,
  Lock,
  Camera,
} from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { authUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    role: "",
    created_at: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (authUser) {
      setProfile(authUser);

      setFormData({
        name: authUser.name || "",
        phone: authUser.phone || "",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.put(
        "/admin/profile/update",
        formData
      );

      setProfile(data.user);

      toast.success(data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Admin Profile
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your profile information.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

          <div className="flex flex-col items-center">

            <div className="relative">

              <img
                src={
                  profile.avatar?.url ||
                  "https://ui-avatars.com/api/?name=Admin"
                }
                alt=""
                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500"
              />

              <button className="absolute bottom-0 right-0 bg-indigo-600 p-3 rounded-full">
                <Camera size={18} />
              </button>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {profile.name}
            </h2>

            <span className="mt-3 bg-indigo-600 px-4 py-1 rounded-full text-sm">
              {profile.role}
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2">
                Name
              </label>

              <div className="relative">

                <User
                  className="absolute left-4 top-4"
                  size={18}
                />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-12 w-full bg-slate-800 rounded-xl p-4"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2">
                Phone
              </label>

              <div className="relative">

                <Phone
                  className="absolute left-4 top-4"
                  size={18}
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-12 w-full bg-slate-800 rounded-xl p-4"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-4 top-4"
                  size={18}
                />

                <input
                  disabled
                  value={profile.email}
                  className="pl-12 w-full bg-slate-800 rounded-xl p-4 opacity-70"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2">
                Role
              </label>

              <div className="relative">

                <Shield
                  className="absolute left-4 top-4"
                  size={18}
                />

                <input
                  disabled
                  value={profile.role}
                  className="pl-12 w-full bg-slate-800 rounded-xl p-4 opacity-70"
                />

              </div>

            </div>

            <div className="md:col-span-2">

              <label className="block mb-2">
                Joined
              </label>

              <div className="relative">

                <Calendar
                  className="absolute left-4 top-4"
                  size={18}
                />

                <input
                  disabled
                  value={
                    profile.created_at
                      ? new Date(
                          profile.created_at
                        ).toLocaleDateString()
                      : ""
                  }
                  className="pl-12 w-full bg-slate-800 rounded-xl p-4 opacity-70"
                />

              </div>

            </div>

          </div>

          <div className="flex gap-4 mt-10">

            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl"
            >
              <Edit size={18} />

              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl">
              <Lock size={18} />
              Change Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;