import { useEffect, useRef, useState } from "react";
import { Send, Video, Paperclip, CheckCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import createSocketConnection from "../config/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addMessage, addMessages, addParticipants } from "../utils/chatSlice";

const Chat = () => {
  const { targetUserId } = useParams();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.user);
  const chatData = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = user?._id;

  // --------------------------------------------------
  // Find the other participant
  // --------------------------------------------------

  const touserData = chatData?.participants?.find(
    (participant) => participant?._id?.toString() !== userId?.toString(),
  );

  // --------------------------------------------------
  // Fetch chat data
  // --------------------------------------------------

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        const chat = response.data;

        dispatch(addMessages(chat.messages));
        dispatch(addParticipants(chat.participants));
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId, dispatch]);

  // --------------------------------------------------
  // Socket connection
  // --------------------------------------------------

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();

    socketRef.current = socket;

    // Join chat room
    socket.emit("joinchat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    // Receive new message
    const handleMessageReceived = (messageObj) => {
      dispatch(addMessage(messageObj));
    };

    socket.on("messageRecieved", handleMessageReceived);

    // Cleanup
    return () => {
      socket.off("messageRecieved", handleMessageReceived);

      socket.disconnect();

      socketRef.current = null;
    };
  }, [targetUserId, userId, user?.firstName, dispatch]);

  // --------------------------------------------------
  // Auto scroll to latest message
  // --------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatData?.messages]);

  // --------------------------------------------------
  // Send message
  // --------------------------------------------------

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim() || !socketRef.current) {
      return;
    }

    const messageObj = {
      text: message.trim(),
      senderId: userId,
      targetUserId,
      userId,
    };

    socketRef.current.emit("sendMessage", messageObj);

    setMessage("");
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading || !touserData) {
    return (
      <div className="flex h-[calc(100vh-76px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-500" />
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto flex h-[calc(100vh-76px)] max-w-3xl flex-col overflow-hidden bg-[#1D232A]">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-4">
        {/* User */}

        <div className="flex items-center gap-3">
          {/* Avatar */}

          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-500 font-medium text-white">
              {touserData?.photoUrl ? (
                <img
                  src={touserData.photoUrl}
                  alt={touserData.firstName}
                  className="h-full w-full object-cover"
                />
              ) : (
                touserData?.firstName?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Online indicator */}

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1b222b] bg-green-500" />
          </div>

          {/* User information */}

          <div>
            <h2 className="text-sm font-semibold text-white">
              {touserData.firstName} {touserData.lastName}
            </h2>

            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>

        {/* Video button */}

        <button
          type="button"
          onClick={() => navigate("/videoCall/" + targetUserId)}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <Video size={19} />
        </button>
      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-3">
          {chatData?.messages?.map((msg) => {
            const isMine = msg?.senderId?.toString() === userId?.toString();

            return (
              <div
                key={msg?._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                {/* Message bubble */}

                <div
                  className={`max-w-[75%] px-4 py-2.5 ${isMine
                    ? "rounded-2xl rounded-br-md bg-indigo-600 text-white"
                    : "rounded-2xl rounded-bl-md bg-gray-800 text-gray-200"
                    }`}
                >
                  {/* Message text */}

                  <p className="break-words text-sm leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Time + status */}

                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${isMine ? "text-indigo-200" : "text-gray-500"
                      }`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isMine && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scroll target */}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ==================================================
          MESSAGE INPUT
      ================================================== */}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-700/50 bg-[#1b222b] px-4 py-3"
      >
        {/* Attachment */}

        <button
          type="button"
          className="rounded-lg p-2.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <Paperclip size={19} />
        </button>

        {/* Input */}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${touserData.firstName}...`}
          className="flex-1 rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />

        {/* Send */}

        <button
          type="submit"
          disabled={!message.trim()}
          className="rounded-xl bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
