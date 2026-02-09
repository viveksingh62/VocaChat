import { io } from "socket.io-client";

export const createSocket = (token) => {
  return io(import.meta.env.VITE_API_URL, {
    auth: {
      token,
    },
    withCredentials: true,
    transports: ["polling", "websocket"],
    autoConnect: false,
  });
};
