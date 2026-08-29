//chat sysytem setup in frontend side

--download socket.io-client

### configuration

import io from "socket.io-client";
import { BASE_URL } from "../utils/constants";
const createSocketConnection = () => {
return io(BASE_URL);
};

export default createSocketConnection;

//implementing in frontend
useEffect(() => {
const socket = createSocketConnection();
//As soon as the code loaded, the connection is made and joinChat event is emmited
socket.emit("joinchat", { userId, targetUserId });

    return () => socket.disconnect();

}, []);
