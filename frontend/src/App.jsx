import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Googlelogin from "./pages/Googlelogin";
import Chatpage from "./pages/Chatpage";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Notfound from "./pages/Notfound";
import Settings from "./pages/Settings";

import { GoogleOAuthProvider } from "@react-oauth/google";

function PrivateRoute({ children }) {
  const { user,loading } = useContext(AuthContext);
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  // While AuthContext is restoring user from localStorage
  ;

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId="30665335422-d7lovie7idofdrvpnnm7cm75b2oo11l4.apps.googleusercontent.com">
              <Googlelogin />
            </GoogleOAuthProvider>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/chatpage"
          element={
            <PrivateRoute>
              <Chatpage />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/chatpage" />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
