// import axios from "axios";
// import { useState } from "react";
// import validator from "validator";
// import { BASE_URL } from "../utils/constants";

// const ChangePassword = () => {
//   const [formData, setFormData] = useState({
//     oldPasswordByUser: "",
//     newPasswordByuser: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!formData.oldPasswordByUser) {
//       setError("Please enter your current password");
//       return;
//     }

//     if (!validator.isStrongPassword(formData.newPasswordByuser)) {
//       setError("Enter a strong password");
//       return;
//     }

//     if (formData.newPasswordByuser !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.oldPasswordByUser === formData.newPasswordByuser) {
//       setError("New password must be different from old password");
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.patch(
//         BASE_URL + "/profile/password",
//         {
//           oldPasswordByUser: formData.oldPasswordByUser,
//           newPasswordByuser: formData.newPasswordByuser,
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       setSuccess("Password updated successfully");

//       setFormData({
//         oldPasswordByUser: "",
//         newPasswordByuser: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError(err.response?.data || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-74px)] bg-[#1c222b] px-4 py-10">
//       <div className="mx-auto flex max-w-md items-center justify-center">
//         <div className="w-full rounded-2xl border border-gray-700 bg-[#151a21] p-7 shadow-2xl">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
//               🔐
//             </div>

//             <h1 className="text-2xl font-bold text-white">Change Password</h1>

//             <p className="mt-2 text-sm leading-6 text-gray-400">
//               Update your password to keep your account secure.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Current Password */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-300">
//                 Current Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={showOldPassword ? "text" : "password"}
//                   name="oldPasswordByUser"
//                   value={formData.oldPasswordByUser}
//                   onChange={handleChange}
//                   placeholder="Enter current password"
//                   className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowOldPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
//                 >
//                   {showOldPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             {/* New Password */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-300">
//                 New Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   name="newPasswordByuser"
//                   value={formData.newPasswordByuser}
//                   onChange={handleChange}
//                   placeholder="Enter new password"
//                   className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
//                 >
//                   {showNewPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>

//               <p className="mt-2 text-xs text-gray-500">
//                 Use a strong password with letters, numbers and symbols.
//               </p>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-300">
//                 Confirm New Password
//               </label>

//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm new password"
//                   className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
//                 >
//                   {showConfirmPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
//                 <p className="text-sm text-red-400">⚠️ {error}</p>
//               </div>
//             )}

//             {/* Success */}
//             {success && (
//               <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
//                 <p className="text-sm text-green-400">✓ {success}</p>
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loading ? "Updating..." : "Update Password"}
//             </button>
//           </form>

//           {/* Security note */}
//           <div className="mt-6 border-t border-gray-800 pt-5">
//             <p className="text-center text-xs leading-5 text-gray-500">
//               For your security, you'll need to enter your current password
//               before setting a new one.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;

import axios from "axios";
import { useState } from "react";
import validator from "validator";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPasswordByUser: "",
    newPasswordByuser: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.oldPasswordByUser) {
      setError("Please enter your current password");
      return;
    }

    if (!validator.isStrongPassword(formData.newPasswordByuser)) {
      setError("Please enter a strong password");
      return;
    }

    if (formData.newPasswordByuser !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.oldPasswordByUser === formData.newPasswordByuser) {
      setError("New password must be different from old password");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        BASE_URL + "/profile/password",
        {
          oldPasswordByUser: formData.oldPasswordByUser,
          newPasswordByuser: formData.newPasswordByuser,
        },
        {
          withCredentials: true,
        },
      );

      setSuccess("Password updated successfully");

      setFormData({
        oldPasswordByUser: "",
        newPasswordByuser: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#1c222b] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-800 px-7 py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <LockKeyhole size={24} className="text-indigo-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Change Password
                </h1>

                <p className="mt-2 text-sm leading-5 text-gray-400">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-7 py-7">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Current Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPasswordByUser"
                  value={formData.oldPasswordByUser}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-gray-700 bg-[#1c222b] py-3 pl-11 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPasswordByuser"
                  value={formData.newPasswordByuser}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-700 bg-[#1c222b] py-3 pl-11 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Use a strong password with letters, numbers and symbols.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-gray-700 bg-[#1c222b] py-3 pl-11 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Security Info */}
            <div className="flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-indigo-400"
              />

              <p className="text-xs leading-5 text-gray-400">
                Choose a strong password that you don't use on other websites.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-400"
                />

                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LockKeyhole size={18} />

              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-800 bg-[#11161c] px-7 py-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-gray-500"
              />

              <p className="text-xs leading-5 text-gray-500">
                For your security, you'll need to enter your current password
                before setting a new one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
