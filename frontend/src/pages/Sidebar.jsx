import React from "react";

const Sidebar = ({ users, onSelect }) => {
  return (
    <div className="w-screen md:w-72 bg-gradient-to-b from-sky-700 to-sky-900 text-white h-screen flex flex-col">

  {/* Header */}
  <div className="p-4 text-lg font-semibold border-b border-sky-400 sticky top-0 bg-sky-800 z-10">
    Chats
  </div>

  {/* User List */}
  <div className="flex-1 overflow-y-auto">
    {users.map((u) => (
      <div
        key={u._id}
        onClick={() => onSelect(u)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-sky-800/60 cursor-pointer border-b border-sky-500/40"
      >
        <img
          src={u.image}
          alt={u.name}
          className="w-11 h-11 rounded-full object-cover border border-white"
        />
        <p className="font-medium text-sm">{u.name}</p>
      </div>
    ))}
  </div>
</div>

  );
};

export default Sidebar;
