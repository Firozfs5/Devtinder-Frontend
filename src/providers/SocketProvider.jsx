import { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import createSocketConnection from "../config/socket";
import {
  addNotification,
  setNotifications,
} from "../features/notifications/notificationSlice";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const user = useSelector((store) => store.user);
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinUser", user._id);
    });
    socket.on("newNotification", (newNotification) => {
      console.log("🔔 New notification:", newNotification);
      dispatch(addNotification(newNotification));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const notifications = await axios.get(BASE_URL + "/notifications", {
        withCredentials: true,
      });
      return notifications.data;
    } catch (err) {
      console.log("theres a error ", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const notifications = await fetchNotifications();

      if (notifications) {
        dispatch(setNotifications(notifications));
      }
    };

    fetchData();
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
