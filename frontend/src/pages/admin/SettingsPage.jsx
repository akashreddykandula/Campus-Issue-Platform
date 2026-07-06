import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PageWrapper from "../../components/layout/PageWrapper";
import { motion } from "framer-motion";
import { MdDarkMode, MdLightMode, MdAdminPanelSettings, MdInfo } from "react-icons/md";

export default function SettingsPage() {
  const { user }              = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto animate-fade-in space-y-5">
        <h1 className="page-title">Settings</h1>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MdAdminPanelSettings size={20} className="text-primary-500" /> Admin Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary-700 flex items-center justify-center text-white text-xl font-bold">
              {user?.full_name?.[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {user?.department && <p className="text-xs text-gray-400 mt-0.5">{user.department}</p>}
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Currently using <span className="capitalize font-medium">{theme}</span> mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              {theme === "dark" ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
              Switch to {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MdInfo size={20} className="text-primary-500" /> System Information
          </h2>
          <div className="space-y-3 text-sm">
            {[
              ["Platform",   "Campus Issue Management Platform"],
              ["Version",    "1.0.0"],
              ["Frontend",   "React 19 + Vite + Tailwind CSS"],
              ["Backend",    "Python Flask + SQLAlchemy"],
              ["Database",   "SQLite (Dev) / PostgreSQL (Prod)"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-gray-500 dark:text-gray-400">{k}</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
