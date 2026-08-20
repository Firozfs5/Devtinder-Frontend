import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {
  const [emailId, setEmailId] = useState("jesus@gmail.com");
  const [password, setPassword] = useState("Jesus@123");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  useEffect(() => {
    if (userData) navigate("/feed");
  }, []);

  return (
    <div className="min-h-screen bg-[#1c2229] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Dev<span className="text-indigo-400">Tinder</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Connect with developers who build amazing things.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151a21] border border-[#2a313b] rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back 👋
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Login to continue to DevTinder
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text text-gray-300">Email</span>
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input w-full bg-[#1c2229] border-[#343c48] text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="label">
                  <span className="label-text text-gray-300">Password</span>
                </label>

                <a
                  href="#"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-[#1c2229] border-[#343c48] text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500">{"Invalid credentials"}</p>}
            {/* Login */}
            <button
              type="submit"
              className="btn w-full bg-indigo-500 hover:bg-indigo-600 border-none text-white font-semibold"
            >
              Login
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              href="#"
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} DevTinder
        </p>
      </div>
    </div>
  );
};

export default Login;
