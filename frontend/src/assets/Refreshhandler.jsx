import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
function Refreshhandler({ setAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const token = JSON.parse(data)?.token;
    if (token) {
      setAuthenticated(true);
      if (location.pathname == "/" || location.pathname == "/login") {
        navigate("/dashboard", { replace: false });
      }
    }
  }, [location, navigate, setAuthenticated]);
  return null;
}

export default Refreshhandler;
