import { useState } from "react";
import axios from "axios";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { X, Heart, GripHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";

import { BASE_URL } from "../../utils/constants";
import { removeUserFromFeed } from "./feedSlice";

function UserCard({ user }) {
  const { firstName, lastName, photoUrl, gender, age, about, skills, _id } =
    user;

  const dispatch = useDispatch();

  const [isLeaving, setIsLeaving] = useState(false);
  const [action, setAction] = useState(null);

  const x = useMotionValue(0);

  const rotate = useTransform(x, [-280, 0, 280], [-10, 0, 10]);

  const nopeOpacity = useTransform(x, [-220, -70, 0], [1, 0.55, 0]);

  const connectOpacity = useTransform(x, [0, 70, 220], [0, 0.55, 1]);

  const overlayScale = useTransform(
    x,
    [-220, -70, 0, 70, 220],
    [1, 0.9, 0.75, 0.9, 1],
  );

  const imageScale = useTransform(x, [-280, 0, 280], [1.04, 1, 1.04]);

  // ---------------------------------------------------------
  // SEND REQUEST
  // ---------------------------------------------------------

  const handleSendRequest = async (status) => {
    if (isLeaving) return;

    try {
      setAction(status);
      setIsLeaving(true);

      await axios.post(
        `${BASE_URL}/requests/send/${status}/${_id}`,
        {},
        {
          withCredentials: true,
        },
      );

      // Remove this user from Redux after the exit animation.
      setTimeout(() => {
        dispatch(removeUserFromFeed(_id));
      }, 300);
    } catch (error) {
      console.error("Request error:", error);

      setIsLeaving(false);
      setAction(null);
      x.set(0);
    }
  };

  // ---------------------------------------------------------
  // SWIPE
  // ---------------------------------------------------------

  const handleDragEnd = async (_, info) => {
    if (isLeaving) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 120 || velocity > 700) {
      await handleSendRequest("interested");
      return;
    }

    if (offset < -120 || velocity < -700) {
      await handleSendRequest("ignored");
      return;
    }

    x.set(0);
  };

  const exitX = action === "interested" ? 800 : action === "ignored" ? -800 : 0;

  return (
    <AnimatePresence mode="wait">
      {!isLeaving && (
        <motion.article
          key={_id}
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.72}
          onDragEnd={handleDragEnd}
          whileDrag={{
            scale: 1.025,
            cursor: "grabbing",
          }}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            x: exitX,
            opacity: 0,
            rotate: action === "interested" ? 14 : -14,
            scale: 0.9,
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="
            relative w-[calc(100vw-24px)]
            max-w-102.5
            cursor-grab touch-pan-y select-none
            overflow-hidden rounded-3xl
            border border-white/9
            bg-[#151a21]
            shadow-[0_25px_70px_rgba(0,0,0,0.48)]
            sm:w-102.5
          "
        >
          {/* BIG NOPE */}

          <motion.div
            style={{
              opacity: nopeOpacity,
              scale: overlayScale,
            }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="
              -rotate-12 rounded-2xl border-[5px]
              border-red-400 bg-black/25 px-7 py-3
              shadow-[0_0_35px_rgba(248,113,113,0.25)]
              backdrop-blur-[2px]
              sm:border-[6px] sm:px-10 sm:py-4
            "
            >
              <span
                className="
                text-4xl font-black tracking-[0.15em]
                text-red-400
                drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                sm:text-5xl
              "
              >
                NOPE
              </span>
            </div>
          </motion.div>

          {/* BIG CONNECT */}

          <motion.div
            style={{
              opacity: connectOpacity,
              scale: overlayScale,
            }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="
              rotate-12 rounded-2xl border-[5px]
              border-emerald-400 bg-black/25 px-6 py-3
              shadow-[0_0_35px_rgba(52,211,153,0.25)]
              backdrop-blur-[2px]
              sm:border-[6px] sm:px-9 sm:py-4
            "
            >
              <span
                className="
                text-4xl font-black tracking-[0.12em]
                text-emerald-400
                drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                sm:text-5xl
              "
              >
                CONNECT
              </span>
            </div>
          </motion.div>

          {/* IMAGE */}

          <div
            className="
            relative aspect-[4/4.35]
            w-full overflow-hidden bg-[#11161d]
            sm:aspect-[4/3.55]
          "
          >
            <motion.img
              style={{ scale: imageScale }}
              src={photoUrl || "/profileholder.png"}
              alt={`${firstName} ${lastName}`}
              draggable="false"
              className="h-full w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/45 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-[#151a21] via-[#151a21]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <h2 className="truncate text-[27px] font-bold tracking-tight text-white drop-shadow-lg">
                {firstName}
                {lastName && ` ${lastName}`}
                {age && (
                  <span className="ml-2 font-normal text-gray-200">{age}</span>
                )}
              </h2>

              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-300">
                {gender && <span className="capitalize">{gender}</span>}
              </div>
            </div>
          </div>

          {/* DETAILS */}

          <div className="px-5 pb-4 pt-3.5">
            {about && (
              <p className="mb-3 line-clamp-1 text-[12px] leading-5 text-gray-400">
                {about}
              </p>
            )}

            {skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-indigo-400/15 bg-indigo-500/8 px-2.5 py-1 text-[10px] font-medium text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}

                {skills.length > 4 && (
                  <span className="rounded-full border border-white/6 bg-white/3 px-2.5 py-1 text-[10px] text-gray-500">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSendRequest("ignored")}
                className="
                  flex h-11 items-center justify-center gap-2
                  rounded-xl border border-white/10
                  bg-white/2.5
                  text-xs font-semibold text-gray-300
                  transition hover:border-red-400/30
                  hover:bg-red-400/6 hover:text-red-300
                "
              >
                <X size={16} />
                Ignore
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSendRequest("interested")}
                className="
                  flex h-11 items-center justify-center gap-2
                  rounded-xl bg-linear-to-r
                  from-indigo-500 to-purple-500
                  text-xs font-semibold text-white
                  shadow-lg shadow-indigo-500/20
                  transition hover:from-indigo-400
                  hover:to-purple-400
                "
              >
                <Heart size={16} />
                Interested
              </motion.button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-gray-600">
              <GripHorizontal size={12} />
              <span>Swipe left to ignore</span>
              <span className="text-gray-700">•</span>
              <span>Swipe right to connect</span>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}

export default UserCard;
