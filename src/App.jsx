import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Signup from "./components/SignUp";
import ChangePassword from "./components/ChangePassword";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import VideoCall from "./components/VideoCall";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SocketContext from "./components/SocketProvider";

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
