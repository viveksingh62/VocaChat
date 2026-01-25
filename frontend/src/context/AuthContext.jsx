import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user-info");

    if (stored) {
      const parsed = JSON.parse(stored);
      const decoded = jwtDecode(parsed.token);

      setUser({
        ...parsed.user,
        _id: decoded._id, // ✅ FIX
        token: parsed.token,
      });
    }
  }, []);

  const login = (data) => {
    const decoded = jwtDecode(data.token);

    const finalUser = {
      ...data.user,
      _id: decoded._id, // ✅ FIX
      token: data.token,
    };

    localStorage.setItem("user-info", JSON.stringify(data));
    setUser(finalUser); // ✅ VERY IMPORTANT
  };

  return (
    <AuthContext.Provider value={{ user, login,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
