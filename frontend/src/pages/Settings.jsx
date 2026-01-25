import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const [preferredLang, setPreferredLang] = useState("en");
  const navigate = useNavigate();

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLang");
    if (savedLang) setPreferredLang(savedLang);
    else if (user?.preferredLang) setPreferredLang(user.preferredLang);
  }, [user]);

  const changeLanguage = async (lang) => {
    setPreferredLang(lang);
    localStorage.setItem("preferredLang", lang);

    await api.put(`/user/language/${user._id}`, {
      preferredLang: lang,
    });

    setUser({ ...user, preferredLang: lang });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sky-600 font-medium"
          >
            ← Back
          </button>
          <h2 className="font-semibold">Settings</h2>
          <div></div>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-medium">Preferred Language</label>
          <select
            value={preferredLang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("user-info");
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
