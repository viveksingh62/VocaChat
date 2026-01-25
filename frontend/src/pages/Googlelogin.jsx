import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Vocal from "../assets/chatlogo.png"
function Googlelogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const responeGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        // const { name, email, image } = result.data.user;
        // const token = result.data.token;
        login(result.data);
        // const obj = { name, email, image, token };

        // localStorage.setItem("user-info", JSON.stringify(result.data));
        // console.log(token);
        // console.log(result.data.user);
        navigate("/chatpage", { replace: true });
      }
      console.log(authResult);
    } catch (error) {
      console.log("Error while requestion google code : " + error);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responeGoogle,
    onError: responeGoogle,
    flow: "auth-code",
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
        
          <img src={Vocal} alt="Vocal"   className="w-30 mx-auto mb-3"/>
      
        <h1 className="text-xl  font-serif  mb-2">Talk Beyond Barriers </h1>
        <p className="text-gray-500 mb-6">Sign in to continue</p>

        <button
          onClick={googlelogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium pointer cursor-pointer">
            Login with Google
          </span>
        </button>
      </div>
    </div>
  );
}

export default Googlelogin;
