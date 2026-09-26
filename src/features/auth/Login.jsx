import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../profile/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

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
      navigate("/");
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  useEffect(() => {
    if (userData) navigate("/");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dt-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-dt-text">
            Dev<span className="text-dt-primary">ora</span>
          </h1>

          <p className="mt-2 text-sm text-dt-muted">
            Connect with developers who build amazing things.
          </p>
        </div>

        {/* Login Card */}

        <div className="rounded-2xl border border-dt-border bg-dt-surface p-8 shadow-xl">
          <h2 className="mb-2 text-2xl font-bold text-dt-text">
            Welcome back 👋
          </h2>

          <p className="mb-6 text-sm text-dt-muted">
            Login to continue to Devora
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}

            <div>
              <label className="label">
                <span className="label-text text-dt-text">Email</span>
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="
    w-full
    rounded-lg
    border border-dt-border
    bg-dt-surface-2
    px-4 py-3
    text-dt-text
    placeholder:text-dt-muted
    focus:border-dt-primary
    focus:outline-none
    focus:ring-1
    focus:ring-dt-primary/30
  "
              />
            </div>

            {/* Password */}

            <div>
              <div className="flex items-center justify-between">
                <label className="label">
                  <span className="label-text text-dt-text">Password</span>
                </label>

                <a
                  href="#"
                  className="text-sm font-medium text-dt-primary transition-colors hover:text-dt-primary-hover"
                >
                  Forgot password?
                </a>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
    w-full
    rounded-lg
    border border-dt-border
    bg-dt-surface-2
    text-dt-text
    placeholder:text-dt-muted
    px-4 py-3
    focus:border-dt-primary
    focus:outline-none
    focus:ring-1
    focus:ring-dt-primary/30
  "
              />
            </div>

            {/* Error */}

            {error && (
              <p className="text-sm font-medium text-red-500">
                Invalid credentials
              </p>
            )}

            {/* Login */}

            <button
              type="submit"
              className="
                btn w-full
                border-none
                bg-dt-primary
                font-semibold
                text-white
                transition-colors
                hover:bg-dt-primary-hover
              "
            >
              Login
            </button>
          </form>

          {/* Signup */}

          <p className="mt-6 text-center text-sm text-dt-muted">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-dt-primary transition-colors hover:text-dt-primary-hover"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Bottom text */}

        <p className="mt-6 text-center text-xs text-dt-muted">
          © {new Date().getFullYear()} Devora
        </p>
      </div>
    </div>
  );
};

export default Login;
