import { useEffect, useRef, useState } from "react";
import { Send, Video, Paperclip, CheckCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import createSocketConnection from "../../config/socket";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addMessage, addMessages, addParticipants } from "./chatSlice";

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
      socket.emit("leaveChat", {
        userId,
        targetUserId,
      });

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
      <div className="flex h-[calc(100vh-76px)] items-center justify-center bg-dt-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-dt-border border-t-dt-primary" />
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className="
        mx-auto
        flex
        h-[calc(100dvh-76px)]
        w-full
        max-w-3xl
        flex-col
        overflow-hidden
        bg-dt-background
      "
    >
      {/* ========================= HEADER ========================= */}

      <header
        className="
          sticky
          top-0
          z-20
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-dt-border
          bg-dt-surface/95
          px-3
          py-3
          backdrop-blur-md
          sm:px-4
          sm:py-4
        "
      >
        {/* User info */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}

          <div className="relative shrink-0">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-dt-primary
                text-sm
                font-semibold
                text-white
                sm:h-11
                sm:w-11
              "
            >
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

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-dt-surface
                bg-green-500
              "
            />
          </div>

          {/* Name + status */}

          <div className="min-w-0">
            <h2
              className="
                truncate
                text-sm
                font-semibold
                text-dt-text
                sm:text-[15px]
              "
            >
              {touserData.firstName} {touserData.lastName}
            </h2>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <p className="text-xs text-dt-muted">Online</p>
            </div>
          </div>
        </div>

        {/* Video button */}

        <button
          type="button"
          onClick={() => navigate("/videoCall/" + targetUserId)}
          className="
            ml-2
            shrink-0
            rounded-xl
            p-2.5
            text-dt-muted
            transition
            active:scale-95
            hover:bg-dt-surface-2
            hover:text-dt-primary
          "
          aria-label="Start video call"
        >
          <Video size={20} />
        </button>
      </header>

      {/* ========================= MESSAGES ========================= */}

      <main
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          bg-dt-background
          px-3
          py-4
          sm:px-4
          sm:py-6
        "
      >
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {chatData?.messages?.map((msg) => {
            const isMine = msg?.senderId?.toString() === userId?.toString();

            return (
              <div
                key={msg?._id}
                className={`flex w-full ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 sm:max-w-[75%] sm:px-4 ${
                    isMine
                      ? "rounded-2xl rounded-br-md bg-dt-primary text-white"
                      : "rounded-2xl rounded-bl-md border border-dt-border bg-dt-surface text-dt-text"
                  }`}
                >
                  {/* Message */}

                  <p className="wrap-break-word whitespace-pre-wrap text-[13px] leading-relaxed sm:text-sm">
                    {msg.text}
                  </p>

                  {/* Time + status */}

                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] sm:text-[10px] ${
                      isMine ? "text-white/70" : "text-dt-muted"
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
      </main>

      {/* ========================= INPUT ========================= */}

      <footer
        className="
          shrink-0
          border-t
          border-dt-border
          bg-dt-surface
          px-2.5
          py-2.5
          sm:px-4
          sm:py-3
        "
      >
        <form
          onSubmit={handleSend}
          className="mx-auto flex w-full max-w-3xl items-center gap-2"
        >
          {/* Attachment */}

          <button
            type="button"
            className="
              shrink-0
              rounded-xl
              p-2.5
              text-dt-muted
              transition
              active:scale-95
              hover:bg-dt-surface-2
              hover:text-dt-text
            "
            aria-label="Attach file"
          >
            <Paperclip size={19} />
          </button>

          {/* Input */}

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${touserData.firstName}...`}
            className="
              min-w-0
              flex-1
              rounded-xl
              border
              border-dt-border
              bg-dt-surface-2
              px-3.5
              py-2.5
              text-[13px]
              text-dt-text
              outline-none
              transition
              placeholder:text-dt-muted
              focus:border-dt-primary
              focus:ring-1
              focus:ring-dt-primary
              sm:px-4
              sm:text-sm
            "
          />

          {/* Send */}

          <button
            type="submit"
            disabled={!message.trim()}
            className="
              shrink-0
              rounded-xl
              bg-dt-primary
              p-2.5
              text-white
              transition
              active:scale-95
              hover:bg-dt-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
