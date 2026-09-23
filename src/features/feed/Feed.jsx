import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import { BASE_URL } from "../../utils/constants";
import { addFeed } from "./feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });

      dispatch(addFeed(response.data));
    } catch (error) {
      console.error("Feed error:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (feed === null || feed.length === 0) {
      getFeed();
    }
  }, [feed, getFeed]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (feed === null) {
    return (
      <div className="flex min-h-[calc(100dvh-74px)] items-center justify-center bg-[#1c222b] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
          <p className="text-sm text-gray-500">Finding developers...</p>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // EMPTY
  // ---------------------------------------------------------

  if (feed.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-74px)] items-center justify-center bg-[#1c222b] px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/10 bg-indigo-500/10 text-4xl">
            🎉
          </div>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            You're all caught up
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            You've checked everyone currently available. Come back later to
            discover new developers.
          </p>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // FEED
  // ---------------------------------------------------------

  return (
    <main className="min-h-[calc(100dvh-74px)] overflow-x-hidden bg-[#1c222b] px-3 pb-10 pt-4 sm:px-5 sm:pt-8">
      <div className="mx-auto flex w-full max-w-xl justify-center">
        {/* IMPORTANT:
            key must change when feed[0] changes.
            This gives UserCard a fresh local state after
            the previous card leaves. */}
        <UserCard key={feed[0]._id} user={feed[0]} />
      </div>
    </main>
  );
}

export default Feed;
