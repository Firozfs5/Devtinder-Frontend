import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import {
  UserRound,
  UsersRound,
  UserRoundPlus,
  KeyRound,
  Settings,
  LogOut,
} from "lucide-react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-indigo-400 bg-indigo-500/10"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <header className="sticky top-0 z-50 h-[74px] border-b border-gray-800 bg-[#151a21] shadow-md">
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
        {/* ================= LOGO ================= */}
        <div className="absolute left-6">
          <Link
            to="/feed"
            className="text-2xl font-extrabold tracking-tight text-white"
          >
            Dev<span className="text-indigo-400">Tinder</span>
          </Link>
        </div>

        {/* ================= CENTER NAVIGATION ================= */}
        {user && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
            <NavLink to="/feed" className={navLinkStyle}>
              Discover
            </NavLink>

            <NavLink to="/connections" className={navLinkStyle}>
              Connections
            </NavLink>

            <NavLink to="/requests" className={navLinkStyle}>
              Requests{" "}
              {user.requestCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#151a21]">
                  {user.requestCount > 9 ? "9+" : user.requestCount}
                </span>
              )}
            </NavLink>
          </nav>
        )}

        {/* ================= USER RIGHT ================= */}
        {user && (
          <div className="absolute right-6 flex items-center gap-3">
            {/* Welcome */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                Welcome, {user.firstName}
              </p>
            </div>

            {/* Avatar */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring-2 ring-indigo-500/30 transition hover:ring-indigo-500/70">
                  <img
                    alt={`${user.firstName}'s profile`}
                    src={user.photoUrl ? user.photoUrl : "/profileholder.png"}
                  />
                </div>
              </div>

              {/* Dropdown */}
              <ul
                tabIndex="-1"
                className="menu dropdown-content z-[60] mt-3 w-60 rounded-2xl border border-gray-700 bg-[#151a21] p-2 shadow-2xl"
              >
                {/* User info */}
                <li className="pointer-events-none mb-2 border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img
                      src={user.photoUrl ? user.photoUrl : "/profileholder.png"}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.emailId}
                      </p>
                    </div>
                  </div>
                </li>

                {/* My Profile */}
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <UserRound size={18} strokeWidth={1.8} />
                    <span>My Profile</span>
                  </Link>
                </li>

                {/* Connections */}
                <li>
                  <Link
                    to="/connections"
                    className="flex items-center gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <UsersRound size={18} strokeWidth={1.8} />
                    <span>Connections</span>
                  </Link>
                </li>

                {/* Requests */}
                <li>
                  <Link
                    to="/requests"
                    className="flex items-center gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <UserRoundPlus size={18} strokeWidth={1.8} />
                    <span>Requests</span>
                  </Link>
                </li>

                {/* Change Password */}
                <li>
                  <Link
                    to="/password"
                    className="flex items-center gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <KeyRound size={18} strokeWidth={1.8} />
                    <span>Change Password</span>
                  </Link>
                </li>

                {/* Settings */}
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Settings</span>
                  </Link>
                </li>

                <li className="my-1 border-t border-gray-700" />

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogOut}
                    className="flex items-center gap-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
