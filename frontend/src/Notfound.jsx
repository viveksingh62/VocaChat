import React from "react";
import { useNavigate } from "react-router-dom";
function Notfound() {
  const Navigate = useNavigate();
  return (
    <>
      <h1>Not found 404</h1>
      <button onClick={() => Navigate("/login")}>Login</button>
    </>
  );
}

export default Notfound;
