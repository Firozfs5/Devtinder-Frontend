import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";
import { motion, useMotionValue, useTransform } from "framer-motion";

function UserCard({ user }) {
  const { firstName, lastName, photoUrl, gender, age, about, skills, _id } =
    user;

  const dispatch = useDispatch();

  const x = useMotionValue(0);

  // Rotate card while dragging
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // Opacity for left/right labels
  const ignoreOpacity = useTransform(x, [-150, -50], [1, 0]);
  const interestedOpacity = useTransform(x, [50, 150], [0, 1]);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/requests/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;

    // Dragged right enough
    if (offset > 120) {
      await handleSendRequest("interested", _id);
    }

    // Dragged left enough
    else if (offset < -120) {
      await handleSendRequest("ignored", _id);
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-full max-w-md cursor-grab touch-pan-y overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl"
    >
      {/* IGNORE indicator */}
      <motion.div
        style={{ opacity: ignoreOpacity }}
        className="pointer-events-none absolute left-5 top-5 z-20 rounded-xl border-2 border-red-500 px-4 py-2 text-xl font-bold text-red-500"
      >
        IGNORE
      </motion.div>

      {/* INTERESTED indicator */}
      <motion.div
        style={{ opacity: interestedOpacity }}
        className="pointer-events-none absolute right-5 top-5 z-20 rounded-xl border-2 border-green-500 px-4 py-2 text-xl font-bold text-green-500"
      >
        INTERESTED
      </motion.div>

      {/* Profile Image */}
      <div className="relative h-96 w-full">
        <img
          src={photoUrl === "" || !photoUrl ? "/profileholder.png" : photoUrl}
          alt={`${firstName} ${lastName}`}
          className="h-full w-full object-cover"
          draggable="false"
        />

        {/* Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#151a21] to-transparent" />

        {/* Name */}
        <div className="absolute bottom-5 left-5">
          <h2 className="text-2xl font-bold text-white">
            {firstName} {lastName}
            {age && (
              <span className="ml-2 font-normal text-gray-300">{age}</span>
            )}
          </h2>

          {gender && (
            <p className="mt-1 text-sm capitalize text-gray-400">{gender}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {/* About */}
        {about && (
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-indigo-400">
              About
            </h3>

            <p className="text-sm leading-6 text-gray-300">{about}</p>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-indigo-400">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="flex-1 rounded-xl border border-gray-600 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
          >
            Ignore
          </button>

          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="flex-1 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Interested
          </button>
        </div>

        {/* Drag hint */}
        <p className="mt-4 text-center text-xs text-gray-500">
          ← Drag to ignore &nbsp; • &nbsp; Drag to connect →
        </p>
      </div>
    </motion.div>
  );
}

export default UserCard;
