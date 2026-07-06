import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdNotifications, MdDoneAll, MdCircle } from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import { getNotifications, markRead, markAllRead } from "../../api/notificationAPI";
import { useNotifications } from "../../context/NotificationContext";
import { EmptyState, CardSkeleton } from "../../components/common/Pagination";
import { timeAgo } from "../../utils/formatters";
import toast from "react-hot-toast";

const typeColors = {
  success: "text-green-500",
  info:    "text-blue-500",
  warning: "text-yellow-500",
  error:   "text-red-500",
};

export default function NotificationsPage() {
  const { refresh } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ per_page: 50 });
      setNotifications(res.data.notifications);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      refresh();
    } catch (_) {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      refresh();
      toast.success("All notifications marked as read");
    } catch (_) {}
  };

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Notifications</h1>
            {unread > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {unread} unread notification{unread !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unread > 0 && (
            <button onClick={handleMarkAll} className="btn-secondary text-sm gap-1.5">
              <MdDoneAll size={18} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            subtitle="You'll see updates here when your complaints change status."
            icon={<MdNotifications size={48} />}
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`card p-4 flex items-start gap-3 cursor-pointer hover:shadow-panel transition-all ${
                  !n.is_read ? "border-l-4 border-primary-500" : "opacity-75"
                }`}
              >
                <div className={`mt-0.5 shrink-0 ${typeColors[n.notif_type] || "text-gray-400"}`}>
                  {n.is_read ? (
                    <MdCircle size={10} className="text-gray-300 dark:text-gray-600 mt-1" />
                  ) : (
                    <MdCircle size={10} className="mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${n.is_read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{timeAgo(n.created_at)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
