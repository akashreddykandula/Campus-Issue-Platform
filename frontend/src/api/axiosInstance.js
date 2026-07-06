import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor — redirect to login on 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       const isAdminPath = window.location.pathname.startsWith("/admin");
//       window.location.href = isAdminPath ? "/admin/login" : "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
