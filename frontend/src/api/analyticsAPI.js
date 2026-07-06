import api from "./axiosInstance";

export const getOverview           = () => api.get("/analytics/overview");
export const getMonthlyData        = () => api.get("/analytics/monthly");
export const getCategoryData       = () => api.get("/analytics/category");
export const getPriorityData       = () => api.get("/analytics/priority");
export const getLocationData       = () => api.get("/analytics/locations");
export const getResolutionTime     = () => api.get("/analytics/resolution-time");
export const getDepartmentData     = () => api.get("/analytics/department");
export const exportCSV             = () => api.get("/analytics/export-csv", { responseType: "blob" });
