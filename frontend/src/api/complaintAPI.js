import api from "./axiosInstance";

export const getComplaints      = (params) => api.get("/complaints/", { params });
export const getComplaint       = (id)     => api.get(`/complaints/${id}`);
export const createComplaint    = (form)   => api.post("/complaints/", form, { headers: { "Content-Type": "multipart/form-data" } });
export const checkDuplicate     = (data)   => api.post("/complaints/check-duplicate", data);
export const joinComplaint      = (origId, data) => api.post(`/complaints/${origId}/join`, data);
export const getImageUrl        = (filename) => `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/complaints/image/${filename}`;
