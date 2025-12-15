import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userdata = JSON.parse(data);
    setUserInfo(userdata);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };
  console.log(userInfo?.image);
  return (
    <div>
      <h1>Welcome {userInfo?.name}</h1>
      <h1>Email: {userInfo?.email}</h1>
      <img
        src={userInfo?.image}
        alt={userInfo?.email}
        width={150}
        height={150}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default dashboard;
