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
  const { user } = useContext(AuthContext);

  // While AuthContext is restoring user from localStorage
  if (user === null) return null;

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId="972235488284-nuuuld2gesg2182eq4sv24pk86tf54i1.apps.googleusercontent.com">
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
