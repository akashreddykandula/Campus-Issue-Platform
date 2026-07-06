import api from "./axiosInstance";

export const getNotifications  = (params) => api.get("/notifications/", { params });
export const markRead          = (id)     => api.patch(`/notifications/${id}/read`);
export const markAllRead       = ()       => api.patch("/notifications/read-all");
export const getUnreadCount    = ()       => api.get("/notifications/unread-count");
