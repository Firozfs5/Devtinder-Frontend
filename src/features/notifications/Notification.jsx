import axios from "axios";
import { Bell, Check, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants";
import { markAllAsRead, markAsRead } from "./notificationSlice";
import { useNavigate } from "react-router";

const Notification = () => {
  const notifications = useSelector((store) => store.notification.notification);

  const unreadCount = useSelector((store) => store.notification.unreadCount);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function markAllAsReadFunc() {
    try {
      await axios.patch(
        BASE_URL + "/notifications/read-all",
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(markAllAsRead());
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  }

  const markAsReadFunc = async (notification) => {
    try {
      await axios.patch(
        BASE_URL + `/notifications/${notification._id}/read`,
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(markAsRead(notification._id));

      if (notification.type === "connection_request") {
        navigate("/requests");
      } else if (notification.type === "connection_accepted") {
        navigate(`/profile/${notification.sender._id}`);
      } else {
        navigate(`/chat/${notification.sender._id}`);
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* ================= BELL ================= */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Notifications"
        className="
          relative flex h-9 w-9 cursor-pointer
          items-center justify-center
          rounded-lg
          text-dt-muted
          transition-all duration-200
          hover:bg-dt-surface-2
          hover:text-dt-text
        "
      >
        <Bell size={19} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-0.5 -top-0.5
              flex h-4 min-w-4 items-center justify-center
              rounded-full
              bg-dt-primary
              px-1
              text-[9px] font-bold leading-none text-white
              ring-2 ring-dt-surface
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* ================= DROPDOWN ================= */}
      <div
        tabIndex="-1"
        className="
          dropdown-content
          z-[60]
          mt-3

          w-[calc(100vw-24px)]
          max-w-80
          overflow-hidden

          rounded-2xl
          border border-dt-border
          bg-dt-surface
          shadow-xl

          !fixed
          !left-1/2
          !right-auto
          !top-[70px]
          !-translate-x-1/2

          md:!absolute
          md:!left-auto
          md:!right-0
          md:!top-full
          md:!translate-x-0
        "
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b border-dt-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-dt-primary" strokeWidth={1.8} />

            <h3 className="text-sm font-semibold text-dt-text">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <span className="rounded-full bg-dt-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-dt-primary">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsReadFunc}
              className="
                text-xs font-medium
                text-dt-primary
                transition-colors
                hover:text-dt-primary-hover
              "
            >
              Mark all read
            </button>
          )}
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-dt-surface-2">
                <Bell size={19} className="text-dt-muted" strokeWidth={1.7} />
              </div>

              <p className="text-sm font-medium text-dt-text">
                No notifications
              </p>

              <p className="mt-1 text-xs text-dt-muted">
                You're all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                onClick={() => markAsReadFunc(notification)}
                key={notification._id}
                className={`
                  group flex cursor-pointer gap-3
                  border-b border-dt-border
                  px-4 py-3.5
                  transition-colors
                  hover:bg-dt-surface-2
                  ${!notification.isRead ? "bg-dt-primary/5" : ""}
                `}
              >
                {/* Icon */}
                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-dt-primary/10
                    text-dt-primary
                  "
                >
                  {notification.type === "connection_request" && (
                    <UserRound size={16} strokeWidth={1.8} />
                  )}

                  {notification.type === "connection_accepted" && (
                    <Check size={16} strokeWidth={2} />
                  )}

                  {notification.type === "message" && (
                    <Bell size={16} strokeWidth={1.8} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-dt-text">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-[11px] text-dt-muted">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Unread */}
                {!notification.isRead && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-dt-primary" />
                )}
              </div>
            ))
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {notifications.length > 0 && (
          <div className="border-t border-dt-border px-4 py-3 text-center">
            <button
              className="
                text-xs font-medium
                text-dt-muted
                transition-colors
                hover:text-dt-primary
              "
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
