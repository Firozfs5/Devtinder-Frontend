import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/profile/userSlice";
import feedReducer from "../features/feed/feedSlice";
import connectionReducers from "../features/connections/connectionSlice";
import requestsReducer from "../features/connections/requestSlice";
import chatReducer from "../features/chat/chatSlice";
import notificationReducer from "../features/notifications/notificationSlice";
const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducers,
    requests: requestsReducer,
    chat: chatReducer,
    notification: notificationReducer,
  },
});

export default appStore;
