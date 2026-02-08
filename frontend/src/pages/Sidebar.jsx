import React from "react";
import Vocal from "../assets/chatlogo.png";

const Sidebar = ({ users, onSelect, onlineUsers }) => {
  return (
    <div
      className="w-screen md:w-72 h-screen flex flex-col
bg-sky-50"
    >
      {/* Header */}
    <div
  className="flex items-center gap-3 px-5 h-16
  border-b border-slate-200
  sticky top-0 z-10
  bg-sky-100"
>
  <img
    src={Vocal}
    alt="Vocal"
    className="w-10 h-10 object-contain"
  />
  <h2 className="text-lg font-semibold sour-gummy-boom tracking-wide text-slate-800">
    Chats
  </h2>
</div>


      {/* User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
        {users.map((u) => {
          const isOnline = onlineUsers?.has(u._id);

          return (
            <div
              key={u._id}
              onClick={() => onSelect(u)}
              className="flex items-center gap-3 px-4 py-3 mx-2 my-1
              rounded-lg cursor-pointer transition
              hover:bg-white/5"
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover
                  border border-white/20"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full
                  border-2 border-slate-800
                  ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`}
                />
              </div>

              {/* Name */}
              <div className="min-w-0">
                <p className="text-sm truncate sour-gummy-boom text-black">
                  {u.name}
                </p>
                <p
                  className={`text-xs ${
                    isOnline ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="h-14 border-t border-white/10 flex items-center justify-center text-slate-600 text-sm">
        About
      </div>
    </div>
  );
};

export default Sidebar;
