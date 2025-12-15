import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Googlelogin from "./Googlelogin";
import Dashboard from "./dashboard";
import Notfound from "./Notfound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Refreshhandler from "./assets/Refreshhandler";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="30665335422-vvt87a05ii0cn9fchlprjn9rljgurr7c.apps.googleusercontent.com">
        <Googlelogin />
      </GoogleOAuthProvider>
    );
  };
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };
  return (
    <BrowserRouter>
      <Refreshhandler setAuthenticated={setAuthenticated} />
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
