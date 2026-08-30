import { useEffect, useRef, useState } from "react";
import { Send, Video, Paperclip, CheckCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import createSocketConnection from "../config/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
const Chat = () => {
  const { targetUserId } = useParams();
  const [message, setMessage] = useState("");
  const user = useSelector((store) => store.user);
  const socketRef = useRef(null);
  const userId = user._id;

  const [messages, setMessages] = useState([]);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    // console.log(chat?.data?.messages);
    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        senderId: msg.senderId,
        text: msg.text,
        _id: msg._id,
        createdAt: msg.createdAt,
      };
    });

    setMessages(chatMessages);
  };
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();
    //As soon as the code loaded, the connection is made and joinChat event is emmited
    socketRef.current.emit("joinchat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on("messageRecieved", (messageObj) => {
      // console.log(messageObj.sender + ":" + messageObj.text);
      // console.log(messageObj);
      setMessages((prev) => [...prev, messageObj]);
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [targetUserId, userId]);

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const messageObj = {
      text: message,
      senderId: user._id,

      targetUserId,
      userId,
    };
    socketRef.current.emit("sendMessage", messageObj);
    // setMessages((prev) => [...prev, messageObj]);

    setMessage("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-76px)] max-w-3xl flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-medium text-white">
              A
            </div>

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1b222b] bg-green-500" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Alex</h2>

            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>

        <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white">
          <Video size={19} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg?.id}
              className={`flex ${
                msg?.senderId?.toString() === user?._id.toString()
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {console.log(msg)}
              <div
                className={`max-w-[70%] px-3.5 py-2 ${
                  msg?.senderId?.toString() === user?._id.toString()
                    ? "rounded-2xl rounded-br-sm bg-indigo-600 text-white"
                    : "rounded-2xl rounded-bl-sm bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    msg?.senderId?.toString() === user?._id.toString()
                      ? "text-indigo-200"
                      : "text-gray-500"
                  }`}
                >
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {msg?.senderId?.toString() === user?._id.toString() && (
                    <CheckCheck size={12} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-700/50 px-4 py-4"
      >
        <button type="button" className="p-2 text-gray-400 hover:text-white">
          <Paperclip size={19} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="rounded-xl bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
