import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import createSocketConnection from "../config/socket";
import peer from "../service/peer";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  ShieldCheck,
} from "lucide-react";

const VideoCall = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const remoteSocketIdRef = useRef(null);
  const socketRef = useRef(null);
  const userData = useSelector((store) => store.user);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);
  const iceCandidateQueue = useRef([]);

  // ─── CALL TIMER ──────────────────────────────
  useEffect(() => {
    if (remoteSocketId) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [remoteSocketId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ─── WEBRTC HANDLERS ────────────────────────
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    return stream;
  };

  const handleUserCallJoined = async ({ id }) => {
    setRemoteSocketId(id);
    remoteSocketIdRef.current = id;
    const stream = await getMedia();
    stream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, stream);
    });
    const offer = await peer.getOffer();
    socketRef.current.emit("offer", { offer, id });
  };

  const handleOffer = async ({ offer, id }) => {
    setRemoteSocketId(id);
    remoteSocketIdRef.current = id;
    const stream = await getMedia();
    stream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, stream);
    });
    // getAnswer already sets remote description internally
    const answer = await peer.getAnswer(offer);
    socketRef.current.emit("answer", { answer, id });
    // Flush any ICE candidates that arrived before remote description was set
    await flushIceCandidateQueue();
  };

  const handleAnswer = async ({ answer }) => {
    await peer.peer.setRemoteDescription(answer);
    // Flush any ICE candidates that arrived before remote description was set
    await flushIceCandidateQueue();
  };

  const flushIceCandidateQueue = async () => {
    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();
      await peer.peer.addIceCandidate(candidate);
    }
  };

  const handleIncomingIceCandidate = async ({ candidate }) => {
    if (!candidate) return;
    // If remote description isn't set yet, queue the candidate
    if (!peer.peer.remoteDescription) {
      iceCandidateQueue.current.push(candidate);
    } else {
      await peer.peer.addIceCandidate(candidate);
    }
  };

  // ─── SOCKET SETUP ───────────────────────────
  useEffect(() => {
    socketRef.current = createSocketConnection();

    socketRef.current.emit("join:call", {
      targetUserId,
      userId: userData._id,
    });

    socketRef.current.on("user:call:joined", handleUserCallJoined);
    socketRef.current.on("offer", handleOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice-candidate", handleIncomingIceCandidate);

    return () => {
      socketRef.current.off("user:call:joined", handleUserCallJoined);
      socketRef.current.off("offer", handleOffer);
      socketRef.current.off("answer", handleAnswer);
      socketRef.current.off("ice-candidate", handleIncomingIceCandidate);
      socketRef.current.disconnect();
    };
  }, [targetUserId, userData._id]);

  // ─── PEER EVENTS ────────────────────────────
  useEffect(() => {
    peer.peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peer.peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          id: remoteSocketIdRef.current,
        });
      }
    };

    return () => {
      peer.peer.ontrack = null;
      peer.peer.onicecandidate = null;
    };
  }, []);

  // ─── CONTROLS ───────────────────────────────
  const toggleMic = () => {
    if (!myStream) return;
    const audioTrack = myStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (!myStream) return;
    const videoTrack = myStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  const endCall = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
    peer.peer.close();
    socketRef.current?.disconnect();

    // Navigate back and force reload so previous page re-fetches data
    navigate(-1);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [myStream, navigate]);

  // ─── RENDER ─────────────────────────────────
  return (
    <div className="fixed inset-0 bg-[#09090b] text-white flex flex-col overflow-hidden">

      {/* ═══════ HEADER ═══════ */}
      <header className="flex-shrink-0 h-14 sm:h-16 px-4 sm:px-6 border-b border-white/[0.06] bg-[#0f0f12]/70 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Video size={16} />
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight">Video Call</h1>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  remoteSocketId
                    ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                    : "bg-yellow-400 animate-pulse"
                }`}
              />
              {remoteSocketId
                ? `Connected · ${formatTime(callDuration)}`
                : "Waiting..."}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck size={13} />
          <span>Encrypted</span>
        </div>
      </header>

      {/* ═══════ VIDEO AREA ═══════ */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 md:p-6 min-h-0">

        {/* REMOTE VIDEO */}
        <div className="relative w-full h-full max-w-6xl rounded-xl sm:rounded-2xl overflow-hidden bg-[#111114] border border-white/[0.06]">

          {remoteStream ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              ref={(video) => {
                if (video) video.srcObject = remoteStream;
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center mb-4">
                <Users size={28} className="text-blue-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-center">
                Waiting for the other person
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 text-center">
                They'll appear here when they join
              </p>
              <div className="flex gap-1 mt-4">
                <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Remote name tag */}
          {remoteStream && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs sm:text-sm">
              Remote User
            </div>
          )}
        </div>

        {/* LOCAL VIDEO (PiP) */}
        {myStream && (
          <div className="absolute right-3 bottom-20 sm:right-5 sm:bottom-24 md:right-8 md:bottom-28 w-24 sm:w-36 md:w-48 aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-white/15 shadow-2xl shadow-black/60 bg-black z-10">
            <video
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              ref={(video) => {
                if (video) video.srcObject = myStream;
              }}
            />
            <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] sm:text-[10px] text-gray-300">
              You
            </div>
            {!videoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95">
                <VideoOff size={20} className="text-gray-500" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══════ CONTROLS BAR ═══════ */}
      <div className="flex-shrink-0 pb-[env(safe-area-inset-bottom,16px)] pt-3 px-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">

          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
              micOn
                ? "bg-white/10 hover:bg-white/15 text-white"
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
              videoOn
                ? "bg-white/10 hover:bg-white/15 text-white"
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
            title={videoOn ? "Camera off" : "Camera on"}
          >
            {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-14 h-11 sm:w-16 sm:h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg shadow-red-600/30"
            title="End call"
          >
            <PhoneOff size={19} />
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-3 pb-1">
          DevTinder · End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default VideoCall;
