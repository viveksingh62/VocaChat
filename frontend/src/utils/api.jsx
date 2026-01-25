import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);

api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const token = userInfo?.token;
    // console.log("information", userInfo);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
