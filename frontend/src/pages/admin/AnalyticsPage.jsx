import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { MdDownload } from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getMonthlyData, getCategoryData, getPriorityData,
  getLocationData, getResolutionTime, getDepartmentData, exportCSV,
} from "../../api/analyticsAPI";
import { CardSkeleton } from "../../components/common/Pagination";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const CHART_COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899","#10b981","#6366f1","#84cc16","#14b8a6"];

const baseOpts = { responsive: true, plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false };

function ChartCard({ title, children, loading }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {loading ? <CardSkeleton className="h-48 w-full" /> : <div className="h-52">{children}</div>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading]     = useState(true);
  const [monthly, setMonthly]     = useState([]);
  const [category, setCategory]   = useState([]);
  const [priority, setPriority]   = useState([]);
  const [locations, setLocations] = useState([]);
  const [resolution, setResolution] = useState({ average_hours: 0, by_priority: [] });
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    Promise.all([
      getMonthlyData(),
      getCategoryData(),
      getPriorityData(),
      getLocationData(),
      getResolutionTime(),
      getDepartmentData(),
    ]).then(([m, c, p, l, r, d]) => {
      setMonthly(m.data.data || []);
      setCategory(c.data.data || []);
      setPriority(p.data.data || []);
      setLocations(l.data.data || []);
      setResolution(r.data || { average_hours: 0, by_priority: [] });
      setDepartment(d.data.data || []);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href = url; a.download = "complaints_export.csv"; a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (_) { toast.error("Export failed"); }
  };

  // Chart datasets
  const monthlyChart = {
    labels: monthly.map((m) => m.month),
    datasets: [{
      label: "Complaints",
      data: monthly.map((m) => m.count),
      fill: true,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.1)",
      tension: 0.4,
    }],
  };

  const categoryChart = {
    labels: category.map((c) => c.category),
    datasets: [{
      data: category.map((c) => c.count),
      backgroundColor: CHART_COLORS,
    }],
  };

  const priorityChart = {
    labels: priority.map((p) => p.priority_level),
    datasets: [{
      data: priority.map((p) => p.count),
      backgroundColor: ["#22c55e","#f59e0b","#f97316","#ef4444"],
    }],
  };

  const locationChart = {
    labels: locations.map((l) => l.loc),
    datasets: [{
      label: "Complaints",
      data: locations.map((l) => l.count),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    }],
  };

  const resolutionChart = {
    labels: resolution.by_priority.map((r) => r.priority_level),
    datasets: [{
      label: "Avg Hours",
      data: resolution.by_priority.map((r) => r.avg_hours),
      backgroundColor: ["#22c55e","#f59e0b","#f97316","#ef4444"],
      borderRadius: 6,
    }],
  };

  const deptChart = {
    labels: department.map((d) => d.branch),
    datasets: [{
      label: "Complaints",
      data: department.map((d) => d.count),
      backgroundColor: CHART_COLORS,
      borderRadius: 6,
    }],
  };

  return (
    <PageWrapper>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visual insights into campus complaints</p>
          </div>
          <button onClick={handleExport} className="btn-secondary gap-2">
            <MdDownload size={18} /> Export CSV
          </button>
        </div>

        {/* Avg Resolution KPI */}
        {!loading && (
          <div className="card p-5 flex items-center gap-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-100 dark:border-primary-800">
            <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              ⏱
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Resolution Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{resolution.average_hours}h</p>
              <p className="text-xs text-gray-400 mt-0.5">Across all resolved complaints</p>
            </div>
          </div>
        )}

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="📅 Monthly Complaints Trend" loading={loading}>
            <Line data={monthlyChart} options={{ ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } } }} />
          </ChartCard>

          <ChartCard title="🏷 Category Distribution" loading={loading}>
            <Doughnut data={categoryChart} options={baseOpts} />
          </ChartCard>

          <ChartCard title="⚡ Priority Distribution" loading={loading}>
            <Doughnut data={priorityChart} options={baseOpts} />
          </ChartCard>

          <ChartCard title="📍 Most Affected Locations" loading={loading}>
            <Bar data={locationChart} options={{ ...baseOpts, indexAxis: "y", plugins: { ...baseOpts.plugins, legend: { display: false } } }} />
          </ChartCard>

          <ChartCard title="⏰ Resolution Time by Priority (hours)" loading={loading}>
            <Bar data={resolutionChart} options={{ ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } } }} />
          </ChartCard>

          <ChartCard title="🎓 Complaints by Department" loading={loading}>
            <Bar data={deptChart} options={{ ...baseOpts, indexAxis: "y", plugins: { ...baseOpts.plugins, legend: { display: false } } }} />
          </ChartCard>
        </div>
      </div>
    </PageWrapper>
  );
}
