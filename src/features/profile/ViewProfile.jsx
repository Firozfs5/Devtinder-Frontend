import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { BASE_URL } from "../../utils/constants";

const ViewProfile = () => {
  const loggedInUser = useSelector((store) => store.user);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Viewing own profile
        if (!userId) {
          setProfileUser(loggedInUser);
          return;
        }

        // Viewing another user's profile
        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });

        setProfileUser(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to load profile",
        );
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchProfile();
    }
  }, [userId, loggedInUser]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-dt-background">
        <span className="loading loading-spinner loading-lg text-dt-primary" />
      </div>
    );
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-dt-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-dt-surface p-8 text-center shadow-xl">
          <p className="text-red-500">{error}</p>

          <button
            onClick={() => navigate("/feed")}
            className="
              mt-5
              rounded-xl
              bg-dt-primary
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-dt-primary-hover
            "
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  const isOwner = !userId || loggedInUser?._id === profileUser._id;

  const connectionStatus = profileUser?.connectionStatus;

  const connectButtonText =
    connectionStatus === "none" ? "Connect" : connectionStatus || "Connect";

  const profilePhoto = profileUser.photoUrl || "/profileholder.png";

  return (
    <div className="min-h-[calc(100vh-74px)] bg-dt-background px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* =================================================
            BACK
        ================================================= */}

        {userId && (
          <Link
            to="/feed"
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-sm
              text-dt-muted
              transition
              hover:text-dt-text
            "
          >
            <span className="text-lg">←</span>
            Back to Discover
          </Link>
        )}

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-dt-border
            bg-dt-surface
            shadow-2xl
          "
        >
          {/* Cover */}

          <div
            className="
              h-28
              bg-linear-to-r
              from-dt-primary/40
              via-dt-primary/20
              to-dt-primary/5
              sm:h-36
            "
          />

          <div className="px-5 pb-7 sm:px-7">
            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div
              className="
                -mt-14
                flex
                flex-col
                gap-5
                sm:-mt-16
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              {/* Photo + Name */}

              <div className="flex min-w-0 items-end gap-4 sm:gap-5">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  src={profilePhoto}
                  alt={`${profileUser.firstName}'s profile`}
                  onClick={() => setShowPhoto(true)}
                  className="
                    h-24
                    w-24
                    shrink-0
                    cursor-pointer
                    rounded-2xl
                    border-4
                    border-dt-surface
                    object-cover
                    shadow-xl
                    sm:h-28
                    sm:w-28
                  "
                />

                <div className="min-w-0 pb-1">
                  <h1
                    className="
                      truncate
                      text-xl
                      font-bold
                      text-dt-text
                      sm:text-2xl
                    "
                  >
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>

                  <p className="mt-1 text-sm text-dt-muted">
                    {profileUser.age
                      ? `${profileUser.age} years old`
                      : "Developer"}

                    {profileUser.gender && ` • ${profileUser.gender}`}
                  </p>

                  <p className="mt-1 text-xs text-dt-primary">
                    Click photo to view
                  </p>
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              {isOwner ? (
                <Link
                  to="/profile/edit"
                  className="
                    w-full
                    rounded-xl
                    bg-dt-primary
                    px-5
                    py-2.5
                    text-center
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-dt-primary-hover
                    sm:w-auto
                  "
                >
                  ✏️ Edit Profile
                </Link>
              ) : (
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    className="
                      flex-1
                      rounded-xl
                      border
                      border-dt-border
                      bg-dt-surface-2
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-dt-text
                      transition
                      hover:border-dt-primary/40
                      hover:bg-dt-primary/10
                      sm:flex-none
                      sm:px-5
                    "
                  >
                    {connectButtonText}
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${profileUser._id}`)}
                    className="
                      flex-1
                      rounded-xl
                      bg-dt-primary
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-dt-primary-hover
                      sm:flex-none
                      sm:px-5
                    "
                  >
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                ABOUT
            ================================================= */}

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-dt-text">About Me</h2>

              <p className="mt-3 leading-7 text-dt-muted">
                {profileUser.about || "No bio added yet."}
              </p>
            </section>

            {/* =================================================
                SKILLS
            ================================================= */}

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-dt-text">Skills</h2>

              {profileUser.skills?.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-full
                        border
                        border-dt-primary/20
                        bg-dt-primary/10
                        px-3
                        py-1.5
                        text-sm
                        text-dt-primary
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-dt-muted">
                  No skills added yet.
                </p>
              )}
            </section>

            {/* =================================================
                DEVELOPER INFORMATION
            ================================================= */}

            <section
              className="
                mt-8
                grid
                gap-4
                border-t
                border-dt-border
                pt-7
                sm:grid-cols-3
              "
            >
              {/* Age */}

              <div className="rounded-2xl bg-dt-surface-2 p-4">
                <p className="text-xs text-dt-muted">Age</p>

                <p className="mt-1 font-semibold text-dt-text">
                  {profileUser.age || "Not provided"}
                </p>
              </div>

              {/* Gender */}

              <div className="rounded-2xl bg-dt-surface-2 p-4">
                <p className="text-xs text-dt-muted">Gender</p>

                <p className="mt-1 font-semibold capitalize text-dt-text">
                  {profileUser.gender || "Not provided"}
                </p>
              </div>

              {/* Connections */}

              <div className="rounded-2xl bg-dt-surface-2 p-4">
                <p className="text-xs text-dt-muted">Connections</p>

                <p className="mt-1 font-semibold text-dt-text">
                  {profileUser.userConnections ?? 0}
                </p>
              </div>
            </section>

            {/* =================================================
                OWNER SECTION
            ================================================= */}

            {isOwner && (
              <section
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-dt-primary/10
                  bg-dt-primary/5
                  p-5
                "
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-dt-text">
                      Complete your profile
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-dt-muted">
                      Keep your developer profile updated so others can know you
                      better.
                    </p>
                  </div>

                  <Link
                    to="/profile/edit"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-dt-primary/30
                      px-4
                      py-2
                      text-center
                      text-sm
                      font-medium
                      text-dt-primary
                      transition
                      hover:bg-dt-primary/10
                      sm:w-auto
                    "
                  >
                    Update Profile
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          PHOTO VIEWER
      ================================================= */}

      <AnimatePresence>
        {showPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/85
              p-4
            "
            onClick={() => setShowPhoto(false)}
          >
            {/* Close Button */}

            <button
              onClick={() => setShowPhoto(false)}
              className="
                absolute
                right-4
                top-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-xl
                text-white
                backdrop-blur-sm
                transition
                hover:bg-white/20
                sm:right-6
                sm:top-6
              "
              aria-label="Close photo"
            >
              ✕
            </button>

            {/* Photo */}

            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              src={profilePhoto}
              alt={`${profileUser.firstName}'s profile`}
              onClick={(e) => e.stopPropagation()}
              className="
                max-h-[85vh]
                max-w-[92vw]
                rounded-2xl
                object-contain
                shadow-2xl
                sm:max-h-[90vh]
                sm:max-w-[90vw]
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewProfile;
