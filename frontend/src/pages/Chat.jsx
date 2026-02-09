import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function Chat({ conversationId }) {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  if (!socket) return null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [joined, setJoined] = useState(false);

  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const typingDisplayTimeoutRef = useRef(null); // New: For debouncing the display

  // ---------------- JOIN ROOM ----------------
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join-room", conversationId);
    setJoined(true);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingDisplayTimeoutRef.current) {
        clearTimeout(typingDisplayTimeoutRef.current);
      }
      if (isTypingRef.current) {
        socket.emit("stop-typing", { conversationId });
      }
      socket.emit("leave-room", conversationId);
      setJoined(false);
    };
  }, [conversationId, socket]);

  // ---------------- FETCH MESSAGES ----------------
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const res = await api.get(`/message/${conversationId}`);
      setMessages(res.data);
    };

    fetchMessages();
  }, [conversationId]);

  // ---------------- RECEIVE MESSAGE ----------------
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) =>
        prev.some((m) => m._id === data._id) ? prev : [...prev, data],
      );
    });

    socket.on("receive-translation", ({ messageId, textTranslated }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, textTranslated, status: "translated" }
            : m,
        ),
      );
    });

    return () => {
      socket.off("receive-message");
      socket.off("receive-translation");
    };
  }, [socket]);

  // ---------------- TYPING LISTENERS ----------------
  useEffect(() => {
    const handleUserTyping = ({ userId }) => {
      console.log("User typing:", userId, "My ID:", user._id);

      // Only show typing indicator if it's NOT me
      if (userId.toString() !== user._id.toString()) {
        console.log("✅ Showing typing indicator");

        // Clear any pending hide timeout
        if (typingDisplayTimeoutRef.current) {
          clearTimeout(typingDisplayTimeoutRef.current);
        }

        setIsTyping(true);
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      console.log("User stop typing:", userId);

      // Only hide typing indicator if it's NOT me
      if (userId.toString() !== user._id.toString()) {
        console.log("✅ Hiding typing indicator");

        // Add a small delay before hiding to prevent flickering
        typingDisplayTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 300);
      }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [socket, user._id]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!conversationId || !joined) return;

    // Start typing indicator
    if (!isTypingRef.current) {
      console.log("🔵 Emitting typing event");
      socket.emit("typing", { conversationId });
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log("⏱️ Emitting stop-typing event (timeout)");
      socket.emit("stop-typing", { conversationId });
      isTypingRef.current = false;
    }, 2000);
  };

  // ---------------- HANDLE INPUT BLUR ----------------
  const handleInputBlur = () => {
    if (isTypingRef.current && conversationId) {
      console.log(" Emitting stop-typing event (blur)");
      socket.emit("stop-typing", { conversationId });
      isTypingRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;

    socket.emit("message", {
      text: message,
      conversationId,
    });

    // Stop typing indicator when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      console.log("📤 Emitting stop-typing event (submit)");
      socket.emit("stop-typing", { conversationId });
      isTypingRef.current = false;
    }

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-60">
      {/* Header */}
      <div className="bg-slate-70 px-4 py-3 shadow flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-sky-600">
          ← Back
        </button>
        <span className="font-semibold">Conversation</span>
        <Link to="/settings" className="text-sky-600 text-sm">
          ⚙ Settings
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId.toString() === user._id.toString();
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                  isMe ? "bg-sky-500 text-white" : "bg-white text-black shadow"
                }`}
              >
                <p>
                  {isMe
                    ? msg.textOriginal
                    : msg.textTranslated || msg.textOriginal}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {msg.status === "translated" ? "Translated" : "Translating…"}
                </p>
              </div>
            </div>
          );
        })}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-black shadow px-4 py-2 rounded-2xl">
              <div className="flex gap-1 items-center">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t px-3 py-2 flex gap-2"
      >
        <input
          value={message}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="Type a message…"
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <button
          type="submit"
          className="bg-sky-500 text-white px-5 rounded-full text-sm hover:bg-sky-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
