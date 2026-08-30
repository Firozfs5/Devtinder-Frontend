import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";

const ViewProfile = () => {
  const loggedInUser = useSelector((store) => store.user);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If userId exists → viewing another developer
  // If userId doesn't exist → viewing own profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setProfileUser(loggedInUser);
          return;
        }

        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });

        setProfileUser(res.data);
      } catch (err) {
        setError(err.response?.data || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchProfile();
    }
  }, [userId, loggedInUser]);

  let connectBtn = "connect";

  if (profileUser) {
    connectBtn = profileUser?.connectionStatus;
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[#1c222b]">
        <span className="loading loading-spinner loading-lg text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[#1c222b] px-4">
        <div className="rounded-2xl border border-red-500/20 bg-[#151a21] p-8 text-center">
          <p className="text-red-400">{error}</p>

          <button
            onClick={() => navigate("/feed")}
            className="mt-5 rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  const isOwner = !userId || loggedInUser?._id === profileUser._id;

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#1c222b] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        {userId && (
          <Link
            to="/feed"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to Discover
          </Link>
        )}

        {/* Profile Header */}
        <div className="overflow-hidden rounded-3xl border border-gray-700 bg-[#151a21] shadow-2xl">
          {/* Cover */}
          <div className="h-32 bg-linear-to-r from-indigo-600/40 via-purple-600/20 to-indigo-500/10" />

          <div className="px-6 pb-7">
            {/* Photo + Actions */}
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                <img
                  src={profileUser.photoUrl || "/profileholder.png"}
                  alt={`${profileUser.firstName}'s profile`}
                  className="h-28 w-28 rounded-2xl border-4 border-[#151a21] object-cover shadow-xl"
                />

                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-white">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    {profileUser.age
                      ? `${profileUser.age} years old`
                      : "Developer"}
                    {profileUser.gender && ` • ${profileUser.gender}`}
                  </p>
                </div>
              </div>

              {/* Owner / Visitor actions */}
              {isOwner ? (
                <Link
                  to="/profile/edit"
                  className="rounded-xl bg-indigo-500 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  ✏️ Edit Profile
                </Link>
              ) : (
                <div className="flex gap-2">
                  <button className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700">
                    {connectBtn == "none" ? "Connect" : connectBtn}
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${profileUser._id}`)}
                    className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                  >
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* About */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white">About Me</h2>

              <p className="mt-3 leading-7 text-gray-400">
                {profileUser.about || "No bio added yet."}
              </p>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white">Skills</h2>

              {profileUser.skills?.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  No skills added yet.
                </p>
              )}
            </div>

            {/* Developer Information */}
            <div className="mt-8 grid gap-4 border-t border-gray-800 pt-7 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#1c222b] p-4">
                <p className="text-xs text-gray-500">Age</p>
                <p className="mt-1 font-semibold text-white">
                  {profileUser.age || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#1c222b] p-4">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="mt-1 font-semibold capitalize text-white">
                  {profileUser.gender || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#1c222b] p-4">
                <p className="text-xs text-gray-500">Connections</p>
                <p className="mt-1 font-semibold text-white">
                  {profileUser?.userConnections}
                </p>
              </div>
            </div>

            {/* Owner-only section */}
            {isOwner && (
              <div className="mt-8 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      Complete your profile
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Keep your developer profile updated so others can know you
                      better.
                    </p>
                  </div>

                  <Link
                    to="/profile/edit"
                    className="rounded-xl border border-indigo-500/30 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/10"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
