import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api" // local backend
      : "https://chat-backend-39kc.onrender.com/api", // Render backend URL
  withCredentials: true,
});
