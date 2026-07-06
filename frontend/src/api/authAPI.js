import api from "./axiosInstance";

export const registerStudent = (data)      => api.post("/auth/register", data);
export const loginStudent    = (data)      => api.post("/auth/login", data);
export const loginAdmin      = (data)      => api.post("/auth/admin/login", data);
export const logoutUser      = ()          => api.post("/auth/logout");
export const getMe           = ()          => api.get("/auth/me");
