import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  Bell,
  MessageCircle,
  Mail,
  Shield,
  LockKeyhole,
  LogOut,
  Trash2,
  ChevronRight,
  Globe2,
  UserRoundCheck,
  CircleUserRound,
  Settings as SettingsIcon,
  AlertTriangle,
  Check,
} from "lucide-react";

import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

// ================= SECTION HEADER =================

const SectionHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

// ================= SETTING ROW =================

const SettingRow = ({
  icon: Icon,
  iconStyle = "bg-indigo-500/10 text-indigo-400",
  title,
  description,
  children,
}) => {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-gray-800 py-5 last:border-b-0">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="font-medium text-gray-200">{title}</p>

          <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};

// ================= SETTINGS =================

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

  const [profileVisibility, setProfileVisibility] = useState(
    userData.profileVisibility,
  );

  const [allowConnectionRequests, setAllowConnectionRequests] = useState(true);

  const [connectionRequestNotifications, setConnectionRequestNotifications] =
    useState(true);

  const [messageNotifications, setMessageNotifications] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(false);

  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  const [saved, setSaved] = useState(false);

  // ================= VISIBILITY =================

  const handleVisibilityChange = (value) => {
    setProfileVisibility(value);
    setSaved(false);
  };

  const handleSaveVisibility = async () => {
    await axios.patch(
      BASE_URL + "/profile/edit",
      {
        profileVisibility,
      },
      { withCredentials: true },
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(removeUser());

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ================= DELETE ACCOUNT =================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    console.log("Confirmed:", confirmed);

    if (!confirmed) return;

    try {
      console.log("Calling delete API...");

      const res = await axios.delete(BASE_URL + "/profile/delete", {
        withCredentials: true,
      });

      console.log("Delete API successful:", res.data);

      dispatch(removeUser());

      console.log("Redux user removed");

      navigate("/login", { replace: true });

      console.log("Navigate called");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      console.error("Backend response:", err.response?.data);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#1c222b] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
              <SettingsIcon
                size={22}
                className="text-indigo-400"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account, privacy and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* ================= PRIVACY ================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl">
          <div className="border-b border-gray-800 px-6 py-5">
            <SectionHeader
              icon={Shield}
              title="Privacy"
              description="Control who can discover and interact with you."
            />
          </div>

          <div className="px-6">
            {/* PROFILE VISIBILITY */}

            <div className="border-b border-gray-800 py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Eye size={19} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="font-medium text-gray-200">
                    Profile Visibility
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Choose who can discover your developer profile.
                  </p>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {/* EVERYONE */}

                <button
                  type="button"
                  onClick={() => handleVisibilityChange("public")}
                  className={`relative rounded-xl border p-4 text-left transition ${
                    profileVisibility === "public"
                      ? "border-indigo-500/60 bg-indigo-500/10"
                      : "border-gray-700 bg-[#1c222b] hover:border-gray-600"
                  }`}
                >
                  {profileVisibility === "public" && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  <Globe2
                    size={20}
                    className={
                      profileVisibility === "public"
                        ? "text-indigo-400"
                        : "text-gray-500"
                    }
                  />

                  <p className="mt-3 font-medium text-white">Public</p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Anyone can discover your profile.
                  </p>
                </button>

                {/* PRIVATE */}

                <button
                  type="button"
                  onClick={() => handleVisibilityChange("private")}
                  className={`relative rounded-xl border p-4 text-left transition ${
                    profileVisibility === "private"
                      ? "border-indigo-500/60 bg-indigo-500/10"
                      : "border-gray-700 bg-[#1c222b] hover:border-gray-600"
                  }`}
                >
                  {profileVisibility === "private" && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  <LockKeyhole
                    size={20}
                    className={
                      profileVisibility === "private"
                        ? "text-indigo-400"
                        : "text-gray-500"
                    }
                  />

                  <p className="mt-3 font-medium text-white">Private</p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Hide your profile from discovery.
                  </p>
                </button>
              </div>

              {/* SAVE */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleSaveVisibility}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  {saved ? (
                    <>
                      <Check size={16} />
                      Saved
                    </>
                  ) : (
                    "Save Visibility"
                  )}
                </button>

                {saved && (
                  <p className="text-sm text-emerald-400">
                    Visibility preference saved.
                  </p>
                )}
              </div>
            </div>

            {/* CONNECTION REQUESTS */}

            <SettingRow
              icon={UserRoundCheck}
              title="Allow Connection Requests"
              description="Allow other developers to send you connection requests."
              iconStyle="bg-emerald-500/10 text-emerald-400"
            >
              <input
                type="checkbox"
                className="toggle toggle-primary shrink-0"
                checked={allowConnectionRequests}
                onChange={(e) => setAllowConnectionRequests(e.target.checked)}
              />
            </SettingRow>

            {/* ONLINE STATUS */}

            <SettingRow
              icon={CircleUserRound}
              title="Show Online Status"
              description="Let your connections know when you're online."
              iconStyle="bg-cyan-500/10 text-cyan-400"
            >
              <input
                type="checkbox"
                className="toggle toggle-primary shrink-0"
                checked={showOnlineStatus}
                onChange={(e) => setShowOnlineStatus(e.target.checked)}
              />
            </SettingRow>
          </div>
        </section>

        {/* ================= NOTIFICATIONS ================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl">
          <div className="border-b border-gray-800 px-6 py-5">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Choose which notifications you want to receive."
            />
          </div>

          <div className="px-6">
            <SettingRow
              icon={UserRoundCheck}
              title="Connection Requests"
              description="Get notified when someone sends you a connection request."
              iconStyle="bg-indigo-500/10 text-indigo-400"
            >
              <input
                type="checkbox"
                className="toggle toggle-primary shrink-0"
                checked={connectionRequestNotifications}
                onChange={(e) =>
                  setConnectionRequestNotifications(e.target.checked)
                }
              />
            </SettingRow>

            <SettingRow
              icon={MessageCircle}
              title="Messages"
              description="Get notified when you receive a new message."
              iconStyle="bg-purple-500/10 text-purple-400"
            >
              <input
                type="checkbox"
                className="toggle toggle-primary shrink-0"
                checked={messageNotifications}
                onChange={(e) => setMessageNotifications(e.target.checked)}
              />
            </SettingRow>

            <SettingRow
              icon={Mail}
              title="Email Notifications"
              description="Receive important DevTinder updates by email."
              iconStyle="bg-orange-500/10 text-orange-400"
            >
              <input
                type="checkbox"
                className="toggle toggle-primary shrink-0"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </SettingRow>
          </div>
        </section>

        {/* ================= ACCOUNT ================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl">
          <div className="border-b border-gray-800 px-6 py-5">
            <SectionHeader
              icon={CircleUserRound}
              title="Account"
              description="Manage your account and security."
            />
          </div>

          <div className="px-6">
            {/* CHANGE PASSWORD */}

            <button
              onClick={() => navigate("/password")}
              className="flex w-full items-center justify-between gap-4 border-b border-gray-800 py-5 text-left transition hover:bg-white/[0.02]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <LockKeyhole size={19} />
                </div>

                <div>
                  <p className="font-medium text-gray-200">Change Password</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                  </p>
                </div>
              </div>

              <ChevronRight size={19} className="shrink-0 text-gray-600" />
            </button>

            {/* CHANGE EMAIL */}

            <button
              disabled={true}
              onClick={() => navigate("/change-email")}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:bg-white/[0.02]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="font-medium text-gray-200">Change Email</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Update the email address linked to your account.
                  </p>
                </div>
              </div>

              <ChevronRight size={19} className="shrink-0 text-gray-600" />
            </button>
          </div>
        </section>

        {/* ================= SESSION ================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl">
          <div className="border-b border-gray-800 px-6 py-5">
            <SectionHeader
              icon={LogOut}
              title="Session"
              description="Manage your current login session."
            />
          </div>

          <div className="px-6 py-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl border border-gray-700 bg-[#1c222b] px-5 py-4 text-left transition hover:border-red-500/30 hover:bg-red-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <LogOut size={19} />
                </div>

                <div>
                  <p className="font-medium text-gray-200">Log Out</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Sign out of your DevTinder account.
                  </p>
                </div>
              </div>

              <ChevronRight size={19} className="text-gray-600" />
            </button>
          </div>
        </section>

        {/* ================= DANGER ZONE ================= */}

        <section className="overflow-hidden rounded-2xl border border-red-500/20 bg-[#151a21] shadow-xl">
          <div className="border-b border-red-500/10 bg-red-500/3 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-red-400">Danger Zone</h2>

                <p className="mt-1 text-sm text-gray-500">
                  These actions are permanent and cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <button
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-left transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Trash2 size={19} />
                </div>

                <div>
                  <p className="font-medium text-red-300">Delete Account</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Permanently delete your DevTinder account and data.
                  </p>
                </div>
              </div>

              <ChevronRight size={19} className="text-red-500/50" />
            </button>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Settings;
