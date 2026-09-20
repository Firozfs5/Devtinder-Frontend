import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducers from "./connectionSlice";
import requestsReducer from "./requestSlice";
import chatReducer from "./chatSlice";
import notificationReducer from "./notificationSlice";
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
