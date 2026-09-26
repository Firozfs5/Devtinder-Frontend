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
            relative
            w-[calc(100vw-24px)]
            max-w-102.5
            cursor-grab
            touch-pan-y
            select-none
            overflow-hidden
            rounded-3xl
            border
            border-dt-border
            bg-dt-surface
            shadow-[0_25px_70px_rgba(0,0,0,0.18)]
            sm:w-102.5
          "
        >
          {/* =================================================
              NOPE OVERLAY
          ================================================= */}

          <motion.div
            style={{
              opacity: nopeOpacity,
              scale: overlayScale,
            }}
            className="
              pointer-events-none
              absolute
              inset-0
              z-50
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                -rotate-12
                rounded-2xl
                border-[5px]
                border-red-400
                bg-black/25
                px-7
                py-3
                shadow-[0_0_35px_rgba(248,113,113,0.25)]
                backdrop-blur-[2px]
                sm:border-[6px]
                sm:px-10
                sm:py-4
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                  tracking-[0.15em]
                  text-red-400
                  drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  sm:text-5xl
                "
              >
                NOPE
              </span>
            </div>
          </motion.div>

          {/* =================================================
              CONNECT OVERLAY
          ================================================= */}

          <motion.div
            style={{
              opacity: connectOpacity,
              scale: overlayScale,
            }}
            className="
              pointer-events-none
              absolute
              inset-0
              z-50
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                rotate-12
                rounded-2xl
                border-[5px]
                border-emerald-400
                bg-black/25
                px-6
                py-3
                shadow-[0_0_35px_rgba(52,211,153,0.25)]
                backdrop-blur-[2px]
                sm:border-[6px]
                sm:px-9
                sm:py-4
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                  tracking-[0.12em]
                  text-emerald-400
                  drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]
                  sm:text-5xl
                "
              >
                CONNECT
              </span>
            </div>
          </motion.div>

          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            className="
              relative
              aspect-[4/4.35]
              w-full
              overflow-hidden
              bg-dt-surface-2
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

            {/* Top image gradient */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-32
                bg-linear-to-b
                from-black/45
                to-transparent
              "
            />

            {/* Bottom image gradient */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                h-52
                bg-linear-to-t
                from-black/75
                via-black/35
                to-transparent
              "
            />

            {/* User information */}

            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <h2
                className="
                  truncate
                  text-[27px]
                  font-bold
                  tracking-tight
                  text-white
                  drop-shadow-lg
                "
              >
                {firstName}
                {lastName && ` ${lastName}`}

                {age && (
                  <span className="ml-2 font-normal text-white/80">{age}</span>
                )}
              </h2>

              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/70">
                {gender && <span className="capitalize">{gender}</span>}
              </div>
            </div>
          </div>

          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="px-5 pb-4 pt-3.5">
            {/* About */}

            {about && (
              <p
                className="
                  mb-3
                  line-clamp-2
                  text-[12px]
                  leading-5
                  text-dt-muted
                "
              >
                {about}
              </p>
            )}

            {/* Skills */}

            {skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      border
                      border-dt-primary/20
                      bg-dt-primary/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      text-dt-primary
                    "
                  >
                    {skill}
                  </span>
                ))}

                {skills.length > 4 && (
                  <span
                    className="
                      rounded-full
                      border
                      border-dt-border
                      bg-dt-surface-2
                      px-2.5
                      py-1
                      text-[10px]
                      text-dt-muted
                    "
                  >
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Ignore */}

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSendRequest("ignored")}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-dt-border
                  bg-dt-surface-2
                  text-xs
                  font-semibold
                  text-dt-text
                  transition
                  hover:border-red-400/40
                  hover:bg-red-400/10
                  hover:text-red-500
                "
              >
                <X size={16} />
                Ignore
              </motion.button>

              {/* Interested */}

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSendRequest("interested")}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-dt-primary
                  text-xs
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-dt-primary/20
                  transition
                  hover:bg-dt-primary-hover
                "
              >
                <Heart size={16} />
                Interested
              </motion.button>
            </div>

            {/* =================================================
                SWIPE HINT
            ================================================= */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-1.5
                text-[9px]
                text-dt-muted
              "
            >
              <GripHorizontal size={12} />

              <span>Swipe left to ignore</span>

              <span className="opacity-50">•</span>

              <span>Swipe right to connect</span>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}

export default UserCard;
