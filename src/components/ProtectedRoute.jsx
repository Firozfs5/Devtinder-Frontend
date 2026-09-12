import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(!user);

  const fetchUserData = async () => {
    try {
      const user = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(user.data));
    } catch (err) {
      console.log(err.response);
      if (err.status == 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1c222b]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
};

export default ProtectedRoute;
