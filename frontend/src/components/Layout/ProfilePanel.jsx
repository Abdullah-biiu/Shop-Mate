import { useEffect, useState } from "react";
import {
  X,
  LogOut,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { toggleProfile } from "../../store/slices/popupSlice";

import {
  logout,
  updateProfile,
  updatePassword,
} from "../../store/slices/authSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  // POPUP STATE
  const { isProfileOpen } = useSelector(
    (state) => state.popup
  );

  // AUTH STATE
  const {
    authUser,
    isUpdatingProfile,
    isUpdatingPassword,
  } = useSelector((state) => state.auth);

  // FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  // LOAD USER DATA
  useEffect(() => {
    if (authUser) {
      setName(authUser?.name || "");
      setEmail(authUser?.email || "");
    }
  }, [authUser]);

  // LOGOUT
const handleLogout = async () => {
  try {
    await dispatch(logout()).unwrap();
    dispatch(toggleProfile());
  } catch (error) {
    console.log(error);
  }
};

// UPDATE PROFILE
const handleUpdateProfile = async () => {
  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    await dispatch(
      updateProfile(formData)
    ).unwrap();

  } catch (error) {
    console.log(error);
  }
};
  // UPDATE PASSWORD
 const handleUpdatePassword =
  async () => {

    if (
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      toast.error(
        "Please fill all fields"
      );

      return;
    }

    if (
      newPassword !==
      confirmNewPassword
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    await dispatch(
      updatePassword({
        currentPassword,
        newPassword,

        confirmPassword:
          confirmNewPassword,
      })
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // DON'T RENDER IF CLOSED
  if (!isProfileOpen || !authUser)
    return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() =>
          dispatch(toggleProfile())
        }
      />

      {/* PROFILE PANEL */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">
            Profile
          </h2>

          <button
            onClick={() =>
              dispatch(toggleProfile())
            }
            className="p-2 rounded-lg glass-card hover:glow-on-hover transition"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6">

          {/* USER INFO */}
          <div className="text-center mb-6">
            <img
              src={
                authUser?.avatar?.url ||
                "/avatar-holder.avif"
              }
              alt={authUser?.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
            />

            <h3 className="text-lg font-semibold text-foreground">
              {authUser?.name}
            </h3>

            <p className="text-muted-foreground">
              {authUser?.email}
            </p>
          </div>

          {/* UPDATE PROFILE */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">
              Update Profile
            </h3>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full p-3 rounded-lg border border-border bg-secondary text-foreground outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full p-3 rounded-lg border border-border bg-secondary text-foreground outline-none focus:ring-2 focus:ring-primary"
            />

            {/* AVATAR */}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
              <Upload className="w-4 h-4 text-primary" />

              <span>Upload Avatar</span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatar(
                    e.target.files[0]
                  )
                }
                className="hidden"
              />
            </label>

            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="flex justify-center items-center gap-3 p-3 rounded-lg glass-card hover:glow-on-hover transition w-full"
            >
              {isUpdatingProfile ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                  <span>
                    Updating Profile...
                  </span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {/* UPDATE PASSWORD */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">
              Update Password
            </h3>

            {/* CURRENT PASSWORD */}
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg border border-border bg-secondary text-foreground outline-none focus:ring-2 focus:ring-primary"
            />

            {/* NEW PASSWORD */}
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg border border-border bg-secondary text-foreground outline-none focus:ring-2 focus:ring-primary"
            />

            {/* CONFIRM PASSWORD */}
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmNewPassword}
              onChange={(e) =>
                setConfirmNewPassword(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg border border-border bg-secondary text-foreground outline-none focus:ring-2 focus:ring-primary"
            />

            {/* SHOW PASSWORD */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-primary" />
              )}

              {showPassword
                ? "Hide"
                : "Show"}{" "}
              Passwords
            </button>

            {/* UPDATE PASSWORD BUTTON */}
            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="flex justify-center items-center gap-3 p-3 rounded-lg glass-card hover:glow-on-hover transition w-full"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                  <span>
                    Updating Password...
                  </span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="my-6 flex items-center justify-center gap-3 p-3 rounded-lg glass-card hover:glow-on-hover text-destructive hover:text-destructive-foreground transition w-full"
          >
            <LogOut className="w-5 h-5" />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;