import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./features/auth/Login";
import Profile from "./features/profile/Profile";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import Feed from "./features/feed/Feed";
import Connections from "./features/connections/Connections";
import Requests from "./features/connections/Requests";
import Signup from "./features/auth/SignUp";
import ChangePassword from "./features/profile/ChangePassword";
import ViewProfile from "./features/profile/ViewProfile";
import EditProfile from "./features/profile/EditProfile";
import Settings from "./features/settings/Settings";
import Chat from "./features/chat/Chat";
import VideoCall from "./features/video/VideoCall";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import SocketContext from "./providers/SocketProvider";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <SocketContext>
          <BrowserRouter basename="/">
            <Routes>
              {/* Public Route */}

              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Body />}>
                  <Route index element={<Feed />} />
                  <Route path="connections" element={<Connections />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="profile/:userId" element={<ViewProfile />} />
                  <Route path="/password" element={<ChangePassword />} />
                  <Route path="profile/edit" element={<EditProfile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="chat/:targetUserId" element={<Chat />} />
                </Route>

                <Route
                  path="/videoCall/:targetUserId"
                  element={<VideoCall />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </SocketContext>
      </Provider>
    </>
  );
}

export default App;
