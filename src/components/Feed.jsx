import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      const feeds = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(feeds.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (feed === null || feed.length === 0) {
      getFeed();
    }
  }, [feed]);

  if (!feed) return <h1>Loading....</h1>;

  if (feed.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[#1c222b] px-4">
        <div className="text-center">
          <div className="mb-5 text-6xl">🎉</div>

          <h2 className="text-3xl font-bold text-white">No more developers!</h2>

          <p className="mt-3 max-w-md text-gray-400">
            You've gone through everyone available in your feed. Check back
            later for new developers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10">
      {feed && <UserCard user={feed[0]} />}
    </div>
  );
}

export default Feed;
