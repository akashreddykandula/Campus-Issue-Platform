import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard, MdAddCircle, MdList, MdNotifications,
  MdPerson, MdClose, MdShield,
} from "react-icons/md";
import { useNotifications } from "../../context/NotificationContext";

const links = [
  { to: "/dashboard",       icon: MdDashboard,     label: "Dashboard" },
  { to: "/raise-complaint", icon: MdAddCircle,      label: "Raise Complaint" },
  { to: "/my-complaints",   icon: MdList,           label: "My Complaints" },
  { to: "/notifications",   icon: MdNotifications,  label: "Notifications", badge: true },
  { to: "/profile",         icon: MdPerson,         label: "Profile" },
];

export default function StudentSidebar({ open, onClose }) {
  const { unreadCount } = useNotifications();

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <MdShield size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
            Campus Issue<br />Platform
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <MdClose size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <span className="h-5 min-w-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 text-center">Campus Issue Platform v1.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 lg:hidden shadow-2xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
