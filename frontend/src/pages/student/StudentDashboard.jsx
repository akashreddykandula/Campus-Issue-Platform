import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdAddCircle, MdList, MdCheckCircle, MdWarning,
  MdPending, MdFlashOn, MdChevronRight, MdOutlineInbox
} from "react-icons/md";

import PageWrapper from "../../components/layout/PageWrapper";
import { getComplaints } from "../../api/complaintAPI";
import { useAuth } from "../../context/AuthContext";
import { StatusBadge, PriorityBadge } from "../../components/common/StatusBadge";
import { CardSkeleton } from "../../components/common/Pagination";
import { formatDate } from "../../utils/formatters";

// Enhanced StatCard with responsive padding and micro-shadows
function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to || "#"} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</div>
          <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{label}</div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: For accurate metrics, this API should ideally return all stats or a separate summary endpoint.
  useEffect(() => {
    getComplaints({ per_page: 5 })
      .then((res) => setComplaints(res.data.complaints))
      .catch((err) => console.error("Failed to fetch complaints:", err))
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const critical = complaints.filter((c) => c.priority_level === "Critical").length;

  return (
    <PageWrapper>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-1 sm:px-0">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-transparent p-4 sm:p-0 rounded-2xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome, {user?.full_name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {user?.course} • {user?.branch} • <span className="text-primary-600 dark:text-primary-400 font-semibold">Year {user?.year}</span>
            </p>
          </div>
          <Link 
            to="/raise-complaint" 
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm shadow-primary-500/20 py-3 sm:py-2.5 transition-all active:scale-95"
          >
            <MdAddCircle size={20} /> 
            <span>Raise Complaint</span>
          </Link>
        </div>

        {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={MdList} label="Total Complaints" value={total} color="bg-blue-600" to="/my-complaints" />
          <StatCard icon={MdPending} label="Pending" value={pending} color="bg-amber-500" to="/my-complaints?status=Pending" />
          <StatCard icon={MdCheckCircle} label="Resolved" value={resolved} color="bg-emerald-500" to="/my-complaints?status=Resolved" />
          <StatCard icon={MdFlashOn} label="Critical" value={critical} color="bg-rose-500" to="/my-complaints" />
        </div>

        {/* Recent complaints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-md sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Recent Complaints
            </h2>
            <Link to="/my-complaints" className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-0.5 transition-colors">
              View all <MdChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="card p-8 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-gray-200 dark:border-gray-800">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-full mb-3 text-gray-400 dark:text-gray-600">
                <MdOutlineInbox size={36} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">No complaints found matching your profile.</p>
              <Link to="/raise-complaint" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm shadow-sm">
                <MdAddCircle size={18} /> Raise Your First Complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="block"
                >
                  <Link 
                    to={`/complaints/${c.id}`} 
                    className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 dark:border-gray-800/50 hover:border-primary-100 dark:hover:border-primary-900/30 hover:shadow-sm transition-all group block"
                  >
                    {/* Left Column: Information */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {c.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{c.category}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="truncate max-w-[180px] sm:max-w-none">{c.full_location}</span>
                        <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                        <span className="w-full sm:w-auto mt-0.5 sm:mt-0 text-gray-400">{formatDate(c.created_at)}</span>
                      </p>
                    </div>

                    {/* Right Column: Badges & Navigation Action Indicator */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-gray-50 dark:border-gray-800/40 sm:border-t-0 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <PriorityBadge level={c.priority_level} />
                        <StatusBadge status={c.status} />
                      </div>
                      <MdChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors hidden sm:block ml-2" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}