import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard, MdList, MdBarChart, MdPeople,
  MdSettings, MdClose, MdAdminPanelSettings,
} from "react-icons/md";

const links = [
  { to: "/admin/dashboard",   icon: MdDashboard,           label: "Dashboard" },
  { to: "/admin/complaints",  icon: MdList,                label: "Complaints" },
  { to: "/admin/analytics",   icon: MdBarChart,            label: "Analytics" },
  { to: "/admin/students",    icon: MdPeople,              label: "Students" },
  { to: "/admin/settings",    icon: MdSettings,            label: "Settings" },
];

export default function AdminSidebar({ open, onClose }) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary-700 flex items-center justify-center">
            <MdAdminPanelSettings size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
            Admin Panel
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <MdClose size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 text-center">Admin Portal v1.0</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {content}
      </aside>

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
