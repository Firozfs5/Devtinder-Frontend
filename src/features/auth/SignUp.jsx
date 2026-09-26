import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Signup() {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(BASE_URL + "/signup", formData, {
        withCredentials: true,
      });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) navigate("/");
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-dt-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-dt-border bg-dt-surface p-8 shadow-xl">
        {/* Heading */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dt-text">
            Join <span className="text-dt-primary">Devora</span>
          </h1>

          <p className="mt-2 text-sm text-dt-muted">
            Create your account and start connecting with developers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First + Last Name */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                className="
                  w-full rounded-xl
                  border border-dt-border
                  bg-dt-surface-2
                  px-4 py-3
                  text-dt-text
                  placeholder:text-dt-muted
                  outline-none
                  transition
                  focus:border-dt-primary
                  focus:ring-1
                  focus:ring-dt-primary/30
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="
                  w-full rounded-xl
                  border border-dt-border
                  bg-dt-surface-2
                  px-4 py-3
                  text-dt-text
                  placeholder:text-dt-muted
                  outline-none
                  transition
                  focus:border-dt-primary
                  focus:ring-1
                  focus:ring-dt-primary/30
                "
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-dt-text">
              Email
            </label>

            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="
                w-full rounded-xl
                border border-dt-border
                bg-dt-surface-2
                px-4 py-3
                text-dt-text
                placeholder:text-dt-muted
                outline-none
                transition
                focus:border-dt-primary
                focus:ring-1
                focus:ring-dt-primary/30
              "
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-dt-text">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              className="
                w-full rounded-xl
                border border-dt-border
                bg-dt-surface-2
                px-4 py-3
                text-dt-text
                placeholder:text-dt-muted
                outline-none
                transition
                focus:border-dt-primary
                focus:ring-1
                focus:ring-dt-primary/30
              "
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
              {success}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl
              bg-dt-primary
              py-3
              font-semibold
              text-white
              transition
              hover:bg-dt-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login */}

        <p className="mt-6 text-center text-sm text-dt-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              font-semibold
              text-dt-primary
              transition-colors
              hover:text-dt-primary-hover
            "
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
