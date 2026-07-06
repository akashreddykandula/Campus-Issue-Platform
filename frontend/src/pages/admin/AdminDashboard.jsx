import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdList, MdPending, MdCheckCircle, MdFlashOn,
  MdPeople, MdTrendingUp, MdWarning,
} from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import { getAdminDashboard } from "../../api/adminAPI";
import { StatusBadge, PriorityBadge } from "../../components/common/StatusBadge";
import { CardSkeleton } from "../../components/common/Pagination";
import { formatDate } from "../../utils/formatters";

function KpiCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ov = data?.overview || {};

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of all campus complaints</p>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={MdList}       label="Total Complaints" value={ov.total       ?? 0} color="bg-primary-600" />
            <KpiCard icon={MdPending}    label="Pending"          value={ov.pending     ?? 0} color="bg-yellow-500" />
            <KpiCard icon={MdCheckCircle} label="Resolved"        value={ov.resolved    ?? 0} color="bg-green-500"  sub={`${ov.resolution_rate ?? 0}% rate`} />
            <KpiCard icon={MdFlashOn}    label="Critical"         value={ov.critical    ?? 0} color="bg-red-500" />
            <KpiCard icon={MdTrendingUp} label="In Progress"      value={ov.in_progress ?? 0} color="bg-blue-500" />
            <KpiCard icon={MdWarning}    label="Escalated"        value={ov.escalated   ?? 0} color="bg-purple-500" />
            <KpiCard icon={MdPeople}     label="Students"         value={ov.students    ?? 0} color="bg-teal-500" />
            <KpiCard icon={MdCheckCircle} label="Resolution Rate" value={`${ov.resolution_rate ?? 0}%`} color="bg-indigo-500" />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
              <Link to="/admin/complaints" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
            ) : (
              <div className="space-y-3">
                {(data?.recent_complaints || []).map((c) => (
                  <Link key={c.id} to={`/admin/complaints`} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors block">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.student?.full_name} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <PriorityBadge level={c.priority_level} />
                      <StatusBadge status={c.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Critical Pending */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                Critical — Needs Immediate Action
              </h2>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
            ) : (data?.critical_pending || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <MdCheckCircle size={36} className="text-green-400 mb-2" />
                <p className="text-sm">No critical issues pending 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.critical_pending || []).map((c) => (
                  <div key={c.id} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 truncate">{c.title}</p>
                    <p className="text-xs text-red-500 mt-0.5">
                      {c.category} · {c.full_location} · {c.student?.full_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
