import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { switchTheme } from "../features/profile/userSlice";
import { BASE_URL } from "../utils/constants";

const ThemeToggle = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [dark, setDark] = useState(user?.theme === "dark");

  // Apply theme when user/theme changes
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
  }, [dark]);

  const toggleTheme = async () => {
    const newTheme = dark ? "light" : "dark";

    // Change UI immediately
    setDark(newTheme === "dark");

    try {
      await axios.patch(
        BASE_URL + "/profile/theme",
        {
          theme: newTheme,
        },
        {
          withCredentials: true,
        },
      );

      // Update Redux user
      dispatch(switchTheme(newTheme));
    } catch (err) {
      console.error("Failed to save theme:", err);

      // Revert if backend fails
      setDark(dark);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-8 w-14 items-center rounded-full border border-dt-border bg-dt-surface-2 p-0.5 transition-colors duration-200 hover:border-dt-primary"
    >
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-dt-primary text-white shadow-sm transition-transform duration-200 ${
          dark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>

      <span className="flex w-full items-center justify-between px-1.5">
        <Sun size={12} className={dark ? "opacity-30" : "opacity-40"} />

        <Moon size={12} className={dark ? "opacity-40" : "opacity-30"} />
      </span>
    </button>
  );
};

export default ThemeToggle;
