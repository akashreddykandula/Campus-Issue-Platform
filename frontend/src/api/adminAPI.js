import api from "./axiosInstance";

export const getAdminDashboard    = ()           => api.get("/admin/dashboard");
export const getAllComplaints      = (params)     => api.get("/admin/complaints", { params });
export const updateComplaintStatus = (id, data)  => api.put(`/admin/complaints/${id}/status`, data);
export const assignComplaint      = (id, data)   => api.post(`/admin/complaints/${id}/assign`, data);
export const deleteComplaint      = (id)         => api.delete(`/admin/complaints/${id}`);
export const getAllStudents        = (params)     => api.get("/admin/students", { params });
export const getStudent           = (id)         => api.get(`/admin/students/${id}`);
export const toggleStudent        = (id)         => api.patch(`/admin/students/${id}/toggle`);
