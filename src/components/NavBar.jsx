import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../features/profile/userSlice";
import {
  UserRound,
  UsersRound,
  UserRoundPlus,
  Settings,
  LogOut,
} from "lucide-react";
import Notification from "../features/notifications/Notification";
import ThemeToggle from "./ThemeToggle";

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
    `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-dt-primary/10 text-dt-primary"
        : "text-dt-muted hover:bg-dt-surface-2 hover:text-dt-text"
    }`;

  return (
    <header className="sticky top-0 z-50 h-18.5 border-b border-dt-border bg-dt-surface shadow-sm">
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
        {/* ================= LOGO ================= */}
        <div className="absolute left-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-dt-text"
          >
            Dev<span className="text-dt-primary">ora</span>
          </Link>
        </div>

        {/* ================= CENTER NAVIGATION ================= */}
        {user && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkStyle}>
              Discover
            </NavLink>

            <NavLink to="/connections" className={navLinkStyle}>
              Connections
            </NavLink>

            <NavLink to="/requests" className={`relative ${navLinkStyle({})}`}>
              Requests
              {user.requestCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-dt-primary px-1 text-[9px] font-bold leading-none text-white ring-2 ring-dt-surface">
                  {user.requestCount > 9 ? "9+" : user.requestCount}
                </span>
              )}
            </NavLink>

            <Notification />
          </nav>
        )}

        {/* ================= USER RIGHT ================= */}
        {user && (
          <div className="absolute right-6 flex items-center gap-3">
            {/* Mobile notification */}
            <div className="md:hidden">
              <Notification />
            </div>

            {/* Theme */}
            <ThemeToggle />

            {/* Welcome */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-dt-text">
                Welcome, {user.firstName}
              </p>
            </div>

            {/* Avatar */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-ghost btn-circle"
              >
                <div className="w-10 rounded-full ring-2 ring-dt-primary/20 transition-all hover:ring-dt-primary/60">
                  <img
                    alt={`${user.firstName}'s profile`}
                    src={user.photoUrl || "/profileholder.png"}
                  />
                </div>
              </div>

              {/* ================= DROPDOWN ================= */}
              <ul
                tabIndex="-1"
                className="menu dropdown-content z-60 mt-3 w-60 rounded-2xl border border-dt-border bg-dt-surface p-2 shadow-xl"
              >
                {/* User info */}
                <li className="pointer-events-none mb-2 border-b border-dt-border pb-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img
                      src={user.photoUrl || "/profileholder.png"}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-dt-border"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-dt-text">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="truncate text-xs text-dt-muted">
                        {user.emailId}
                      </p>
                    </div>
                  </div>
                </li>

                {/* Menu items */}
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-dt-muted transition-colors hover:bg-dt-surface-2 hover:text-dt-text"
                  >
                    <UserRound size={18} strokeWidth={1.8} />
                    <span>My Profile</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/connections"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-dt-muted transition-colors hover:bg-dt-surface-2 hover:text-dt-text"
                  >
                    <UsersRound size={18} strokeWidth={1.8} />
                    <span>Connections</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/requests"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-dt-muted transition-colors hover:bg-dt-surface-2 hover:text-dt-text"
                  >
                    <UserRoundPlus size={18} strokeWidth={1.8} />
                    <span>Requests</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-dt-muted transition-colors hover:bg-dt-surface-2 hover:text-dt-text"
                  >
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Settings</span>
                  </Link>
                </li>

                {/* Divider */}
                <li className="my-1 border-t border-dt-border" />

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogOut}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
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
