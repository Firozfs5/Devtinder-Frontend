import axios from "axios";
import { Bell, Check, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants";
import { markAllAsRead, markAsRead } from "./notificationSlice";
import { useNavigate } from "react-router";

const Notification = () => {
  // Temporary data — later this will come from Redux

  const notifications = useSelector((store) => store.notification.notification);

  const unreadCount = useSelector((store) => store.notification.unreadCount);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function markAllAsReadFunc() {
    await axios.patch(
      BASE_URL + "/notifications/read-all",
      {},
      {
        withCredentials: true,
      },
    );
    dispatch(markAllAsRead());
  }

  const markAsReadFunc = async (notification) => {
    await axios.patch(
      BASE_URL + `/notifications/${notification._id}/read`,
      {},
      { withCredentials: true },
    );
    dispatch(markAsRead(notification._id));

    if (notification.type == "connection_request") navigate("/requests");
    else if (notification.type == "connection_accepted")
      navigate(`/profile/${notification.sender._id}`);
    else navigate(`/chat/${notification.sender._id}`);
  };

  return (
    <div className="dropdown dropdown-end">
      {/* ================= BELL ================= */}
      <div
        tabIndex={0}
        role="button"
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-800 hover:text-white"
      >
        <Bell size={21} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#151a21]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* ================= DROPDOWN ================= */}
      <div
        tabIndex="-1"
        className="dropdown-content z-60 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
          <h3 className="font-semibold text-white">Notifications</h3>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadFunc()}
              className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell size={30} className="mx-auto mb-2 text-gray-600" />

              <p className="text-sm text-gray-400">No notifications</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div
                onClick={() => {
                  // console.log(notification._id);
                  markAsReadFunc(notification);
                }}
                key={notification._id}
                className={`flex gap-3 border-b border-gray-800 px-4 py-4 transition hover:bg-gray-800/50 ${
                  !notification.isRead ? "bg-indigo-500/5" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                  {notification.type === "connection_request" && (
                    <UserRound size={17} />
                  )}

                  {notification.type === "connection_accepted" && (
                    <Check size={17} />
                  )}

                  {notification.type === "message" && <Bell size={17} />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-gray-200">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Unread dot */}
                {!notification.isRead && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-700 px-4 py-3 text-center">
            <button className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
