import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notification.unshift(action.payload);
      state.unreadCount += 1;
    },
    setNotifications: (state, action) => {
      state.unreadCount = action.payload.filter(
        (notification) => !notification.isRead,
      ).length;
      state.notification = action.payload;
    },
    markAsRead: (state, action) => {
      const notification = state.notification.find(
        (notification) => notification._id === action.payload,
      );

      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notification.forEach((notification) => {
        notification.isRead = true;
      });

      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});
export const {
  addNotification,
  setNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
