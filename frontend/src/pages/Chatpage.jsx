  import React, { useContext, useEffect, useState } from "react";
  import { AuthContext } from "../context/AuthContext";
  import api from "../utils/api";
  import { useNavigate } from "react-router-dom";
  import Sidebar from "./Sidebar";
  import Chat from "./Chat";

  const Chatpage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
      const fetchUsers = async () => {
        const res = await api.get("/user");
        const filtered = res.data.filter((u) => u._id !== user._id);
        setUsers(filtered);
      };
      fetchUsers();
    }, [user]);

    const handleSelectuser = async (receiver) => {
      const res = await api.post("/conversation", {
        recieverId: receiver._id,
      });
      setConversationId(res.data._id);
      setShowSidebar(false); // hide sidebar on mobile
    };

    

return (
  <div className="flex h-screen bg-slate-200 overflow-hidden">

    {/* Sidebar */}
    <div className={`${showSidebar ? "block" : "hidden"} md:block`}>
      <Sidebar users={users} onSelect={handleSelectuser} />
    </div>

    {/* Chat Area */}
    <div className="flex-1 relative">
      {conversationId ? (
        <Chat conversationId={conversationId} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
          Select a user to start chat
        </div>
      )}

      {/* Mobile Back Button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden fixed top-3 left-3 bg-sky-500 text-white px-3 py-1 rounded-full shadow"
        >
          ← Chats
        </button>
      )}
    </div>
  </div>
);

  };

  export default Chatpage;
