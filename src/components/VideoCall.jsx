import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  ShieldCheck,
  Maximize2,
  RotateCcw,
  Grip,
} from "lucide-react";

import createSocketConnection from "../config/socket";
import peer from "../service/peer";

const VideoCall = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // false = remote large, true = local large
  const [isLocalMain, setIsLocalMain] = useState(false);

  // PiP position
  const [pipPosition, setPipPosition] = useState({
    x: 0,
    y: 0,
  });

  const socketRef = useRef(null);
  const remoteSocketIdRef = useRef(null);
  const timerRef = useRef(null);
  const iceCandidateQueue = useRef([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const stageRef = useRef(null);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (!remoteSocketId) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remoteSocketId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  // =========================================================
  // MEDIA
  // =========================================================

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);
      return stream;
    } catch (error) {
      console.error("Camera / microphone error:", error);
      return null;
    }
  };

  // =========================================================
  // WEBRTC
  // =========================================================

  const handleUserCallJoined = async ({ id }) => {
    try {
      setRemoteSocketId(id);
      remoteSocketIdRef.current = id;

      const stream = await getMedia();
      if (!stream) return;

      stream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, stream);
      });

      const offer = await peer.getOffer();

      socketRef.current?.emit("offer", {
        offer,
        id,
      });
    } catch (error) {
      console.error("Call joined error:", error);
    }
  };

  const handleOffer = async ({ offer, id }) => {
    try {
      setRemoteSocketId(id);
      remoteSocketIdRef.current = id;

      const stream = await getMedia();
      if (!stream) return;

      stream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, stream);
      });

      const answer = await peer.getAnswer(offer);

      socketRef.current?.emit("answer", {
        answer,
        id,
      });

      await flushIceCandidates();
    } catch (error) {
      console.error("Offer error:", error);
    }
  };

  const handleAnswer = async ({ answer }) => {
    try {
      await peer.peer.setRemoteDescription(answer);
      await flushIceCandidates();
    } catch (error) {
      console.error("Answer error:", error);
    }
  };

  const flushIceCandidates = async () => {
    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();

      try {
        await peer.peer.addIceCandidate(candidate);
      } catch (error) {
        console.error("Queued ICE error:", error);
      }
    }
  };

  const handleIncomingIceCandidate = async ({ candidate }) => {
    if (!candidate) return;

    if (!peer.peer.remoteDescription) {
      iceCandidateQueue.current.push(candidate);
      return;
    }

    try {
      await peer.peer.addIceCandidate(candidate);
    } catch (error) {
      console.error("ICE candidate error:", error);
    }
  };

  // =========================================================
  // SOCKET
  // =========================================================

  useEffect(() => {
    if (!userData?._id || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("join:call", {
      targetUserId,
      userId: userData._id,
    });

    socket.on("user:call:joined", handleUserCallJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIncomingIceCandidate);

    return () => {
      socket.off("user:call:joined", handleUserCallJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIncomingIceCandidate);
      socket.disconnect();
    };
  }, [targetUserId, userData?._id]);

  // =========================================================
  // PEER EVENTS
  // =========================================================

  useEffect(() => {
    peer.peer.ontrack = (event) => {
      const stream = event.streams?.[0];

      if (stream) {
        setRemoteStream(stream);
      }
    };

    peer.peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      if (!socketRef.current) return;

      socketRef.current.emit("ice-candidate", {
        candidate: event.candidate,
        id: remoteSocketIdRef.current,
      });
    };

    return () => {
      peer.peer.ontrack = null;
      peer.peer.onicecandidate = null;
    };
  }, []);

  // =========================================================
  // IMPORTANT:
  // Keep BOTH VIDEO ELEMENTS MOUNTED.
  // We only change z-index/opacity.
  // This prevents the large-video stream from disappearing
  // when swapping.
  // =========================================================

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = myStream || null;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream || null;
    }
  }, [remoteStream]);

  // =========================================================
  // CONTROLS
  // =========================================================

  const toggleMic = () => {
    if (!myStream) return;

    const audioTrack = myStream.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  const toggleVideo = () => {
    if (!myStream) return;

    const videoTrack = myStream.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setVideoOn(videoTrack.enabled);
  };

  // =========================================================
  // SWAP
  // =========================================================

  const swapVideos = () => {
    if (!myStream || !remoteStream) return;

    setIsLocalMain((prev) => !prev);
  };

  // =========================================================
  // FULLSCREEN
  // =========================================================

  const handleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await stageRef.current?.requestFullscreen();
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // =========================================================
  // RESET PIP
  // =========================================================

  const resetPip = () => {
    setPipPosition({
      x: 0,
      y: 0,
    });
  };

  // =========================================================
  // END CALL
  // =========================================================

  const endCall = useCallback(() => {
    clearInterval(timerRef.current);

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }

    try {
      peer.peer.close();
    } catch (error) {
      console.error("Peer close error:", error);
    }

    socketRef.current?.disconnect();

    navigate(-1);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [myStream, navigate]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#060608] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0b0b0f]/90 px-3 backdrop-blur-2xl sm:h-16 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <Video size={17} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold">Video Call</h1>

              {remoteSocketId && (
                <span className="hidden rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-emerald-400 sm:block">
                  LIVE
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-gray-400 sm:text-[11px]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  remoteSocketId
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                    : "animate-pulse bg-amber-400"
                }`}
              />

              <span>
                {remoteSocketId
                  ? `Connected · ${formatTime(callDuration)}`
                  : "Waiting for connection"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-gray-500 sm:flex">
            <ShieldCheck size={13} />
            Encrypted
          </div>

          <div
            className={`h-2 w-2 rounded-full ${
              remoteSocketId ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        </div>
      </motion.header>

      {/* =====================================================
          VIDEO STAGE
      ===================================================== */}

      <main
        ref={stageRef}
        className="relative min-h-0 flex-1 p-1.5 sm:p-3 md:p-5"
      >
        {/* VIDEO CARD */}

        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101014] shadow-[0_25px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl">
          {/* =================================================
              REMOTE VIDEO
          ================================================= */}

          {remoteStream && (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                !isLocalMain ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          )}

          {/* =================================================
              LOCAL VIDEO
          ================================================= */}

          {myStream && (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                isLocalMain ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          )}

          {/* =================================================
              WAITING STATE
          ================================================= */}

          {!remoteStream && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#101014] px-6">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10"
              >
                <div className="absolute inset-0 animate-ping rounded-full border border-indigo-400/10" />

                <Users size={30} className="text-indigo-300" />
              </motion.div>

              <h2 className="text-center text-base font-semibold sm:text-lg">
                Waiting for the other person
              </h2>

              <p className="mt-2 max-w-sm text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                Their video will appear here automatically when they join the
                call.
              </p>

              <div className="mt-5 flex gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* =================================================
              CAMERA OFF
          ================================================= */}

          {isLocalMain && myStream && !videoOn && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#111115]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.05]">
                <VideoOff size={26} className="text-gray-500" />
              </div>

              <p className="mt-3 text-sm text-gray-500">Your camera is off</p>
            </div>
          )}

          {/* =================================================
              GRADIENTS
          ================================================= */}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-25 h-24 bg-gradient-to-b from-black/35 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-25 h-40 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* =================================================
              MAIN LABEL
          ================================================= */}

          {(remoteStream || isLocalMain) && (
            <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-xl sm:bottom-5 sm:left-5 sm:px-3.5 sm:py-2 sm:text-sm">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLocalMain ? "bg-indigo-400" : "bg-emerald-400"
                }`}
              />

              {isLocalMain ? "You" : "Remote User"}
            </div>
          )}

          {/* =================================================
              FULLSCREEN
          ================================================= */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleFullscreen}
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-gray-300 backdrop-blur-xl transition hover:bg-black/60 hover:text-white sm:right-5 sm:top-5"
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </motion.button>

          {/* =================================================
              PIP
          ================================================= */}

          {myStream && remoteStream && (
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.08}
              dragConstraints={stageRef}
              animate={{
                x: pipPosition.x,
                y: pipPosition.y,
              }}
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onTap={swapVideos}
              className="group absolute bottom-4 right-3 z-40 aspect-video w-[120px] cursor-grab overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl shadow-black/70 active:cursor-grabbing sm:bottom-7 sm:right-7 sm:w-44 md:w-52"
            >
              {/* Preview is always the opposite stream */}

              {!isLocalMain ? (
                <video
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  ref={(video) => {
                    if (video) {
                      video.srcObject = myStream;
                    }
                  }}
                />
              ) : (
                <video
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                  ref={(video) => {
                    if (video) {
                      video.srcObject = remoteStream;
                    }
                  }}
                />
              )}

              {/* Preview gradient */}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Drag handle */}

              <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/50 text-white/70 backdrop-blur-md">
                <Grip size={12} />
              </div>

              {/* Swap icon */}

              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[11px] text-white backdrop-blur-md">
                ↔
              </div>

              {/* Name */}

              <div className="absolute bottom-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] text-gray-200 backdrop-blur-md sm:text-[10px]">
                {isLocalMain ? "Remote" : "You"}
              </div>

              {/* Local camera off */}

              {!isLocalMain && !videoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#151519]/95">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05]">
                    <VideoOff size={17} className="text-gray-500" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      <motion.footer
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-50 shrink-0 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pt-3"
      >
        <div className="mx-auto flex w-fit items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#101014]/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:gap-2.5 sm:rounded-3xl sm:p-2.5">
          {/* MIC */}

          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            onClick={toggleMic}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition sm:h-12 sm:w-12 sm:rounded-2xl ${
              micOn
                ? "bg-white/[0.07] text-white hover:bg-white/[0.12]"
                : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
            }`}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
          </motion.button>

          {/* CAMERA */}

          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            onClick={toggleVideo}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition sm:h-12 sm:w-12 sm:rounded-2xl ${
              videoOn
                ? "bg-white/[0.07] text-white hover:bg-white/[0.12]"
                : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
            }`}
            title={videoOn ? "Camera off" : "Camera on"}
          >
            {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
          </motion.button>

          {/* RESET */}

          {myStream && remoteStream && (
            <motion.button
              whileTap={{
                scale: 0.88,
                rotate: -20,
              }}
              type="button"
              onClick={resetPip}
              className="hidden h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] text-gray-300 transition hover:bg-white/[0.12] hover:text-white sm:flex sm:h-12 sm:w-12 sm:rounded-2xl"
              title="Reset preview position"
            >
              <RotateCcw size={17} />
            </motion.button>
          )}

          {/* END */}

          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            onClick={endCall}
            className="flex h-11 w-14 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 sm:h-12 sm:w-16 sm:rounded-2xl"
            title="End call"
          >
            <PhoneOff size={19} />
          </motion.button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-gray-600 sm:mt-3 sm:text-[10px]">
          <ShieldCheck size={11} />
          <span>DevTinder secure call</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default VideoCall;
