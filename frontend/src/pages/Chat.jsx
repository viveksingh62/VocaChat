import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../utils/api";
import socket from "../pages/Socket";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Chat({ conversationId }) {
    const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [preferredLang, setPreferredLang] = useState("en");
  const bottomRef = useRef();

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    return () => socket.off("receive-message");
  }, []);

  useEffect(() => {
    socket.on("receive-translation", ({ messageId, textTranslated }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, textTranslated, status: "translated" }
            : m,
        ),
      );
    });
    return () => socket.off("receive-translation");
  }, []);
  useEffect(() => {
    if (user?.preferredLang) {
      setPreferredLang(user.preferredLang);
    }
  }, [user]);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join-room", conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      const res = await api.get(`/message/${conversationId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("message", {
      text: message,
      conversationId,
      senderId: user._id,
    });

    setMessage("");
  };


 return (
  <div className="flex flex-col h-screen bg-slate-100">

    {/* Header */}
   <div className="bg-white px-4 py-3 shadow flex items-center justify-between sticky top-0 z-10">

  {/* Back button - left */}
  <button
    onClick={() => navigate("/")}
    className="text-sky-600 font-medium"
  >
    ← Back
  </button>

  {/* Title - center */}
  <span className="font-semibold text-gray-700 text-base">
    Conversation
  </span>

  {/* Settings - right */}
  <Link
    to="/settings"
    className="text-sky-600 text-sm font-medium hover:text-sky-700"
  >
    ⚙ Settings
  </Link>

</div>


    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
      {messages.map((msg) => {
        const isMe = msg.senderId === user._id;
        return (
          <div
            key={msg._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-[60%] break-words text-sm ${
                isMe
                  ? "bg-sky-500 text-white rounded-br-none"
                  : "bg-white text-black rounded-bl-none shadow"
              }`}
            >
              <p>
                {msg.senderId === user._id
                  ? msg.textOriginal
                  : msg.textTranslated || msg.textOriginal}
              </p>

              {msg.status == "translated" ? (
                <p className="text-[10px] text-green-600 mt-1">
                  Translated
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">
                  Translating...
                </p>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>

    {/* Input Box */}
    <form
      onSubmit={handleSubmit}
      className="bg-white border-t px-3 py-2 flex gap-2 sticky bottom-0"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-300"
      />
      <button
        type="submit"
        className="bg-sky-500 hover:bg-sky-600 text-white px-5 rounded-full text-sm font-medium"
      >
        Send
      </button>
    </form>
  </div>
);

}

export default Chat;
