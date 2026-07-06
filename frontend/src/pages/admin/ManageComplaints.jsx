import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MdDelete, MdEdit, MdVisibility, MdDownload, MdFilterList, MdClose, MdChevronRight
} from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getAllComplaints, updateComplaintStatus, deleteComplaint,
} from "../../api/adminAPI";
import { exportCSV } from "../../api/analyticsAPI";
import { StatusBadge, PriorityBadge } from "../../components/common/StatusBadge";
import { Pagination, SearchBar, EmptyState } from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import { formatDate } from "../../utils/formatters";
import { CATEGORIES, STATUSES } from "../../utils/constants";
import { getImageUrl } from "../../api/complaintAPI";

import {
  FiMapPin, FiUser, FiUsers, FiCalendar, FiTag, FiHash, FiDownload, FiExternalLink
} from 'react-icons/fi';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [catFilter, setCat] = useState("");
  const [prioFilter, setPrio] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modals
  const [statusModal, setStatusModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints({
        page,
        per_page: 15,
        status: statusFilter || undefined,
        category: catFilter || undefined,
        priority: prioFilter || undefined,
        search: search || undefined,
      });
      setComplaints(res.data.complaints);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Fetch errors omitted", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, catFilter, prioFilter, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const openStatusModal = (c) => {
    setSelected(c);
    setNewStatus(c.status);
    setRemark("");
    setStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setSaving(true);
    try {
      await updateComplaintStatus(selected.id, { status: newStatus, remark });
      toast.success("Status updated successfully");
      setStatusModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try {
      await deleteComplaint(id);
      toast.success("Complaint removed");
      fetch();
    } catch (_) {
      toast.error("Delete sequence failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `complaints_export_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV Downloaded");
    } catch (_) {
      toast.error("Export sequence failed");
    }
  };

  const clearFilters = () => {
    setStatus("");
    setCat("");
    setPrio("");
    setPage(1);
  };

  const isFilterActive = statusFilter || catFilter || prioFilter;

  return (
    <PageWrapper>
      <div className="space-y-5 max-w-7xl mx-auto px-1 sm:px-0 animate-fade-in">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Manage Complaints
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {total} system records logged
            </p>
          </div>
          <button 
            onClick={handleExport} 
            className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 shadow-sm text-sm"
          >
            <MdDownload size={18} /> <span>Export CSV</span>
          </button>
        </div>

        {/* Dynamic Mobile Search + Toggle Filter Area */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <SearchBar 
                value={search} 
                onChange={(v) => { setSearch(v); setPage(1); }} 
                placeholder="Search title, roll number, or details..." 
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`md:hidden p-3 rounded-xl border transition-all flex items-center justify-center relative ${
                isFilterActive 
                  ? "border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950/20" 
                  : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900"
              }`}
            >
              <MdFilterList size={22} />
              {isFilterActive && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />}
            </button>
          </div>

          {/* Filters Sheet - Grid format */}
          <div className={`md:flex gap-3 p-4 card border border-gray-100 dark:border-gray-800/60 shadow-sm ${showMobileFilters ? "flex flex-col" : "hidden md:block"}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                <select 
                  value={statusFilter} 
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }} 
                  className="input-base text-xs sm:text-sm py-2.5"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select 
                  value={catFilter} 
                  onChange={(e) => { setCat(e.target.value); setPage(1); }} 
                  className="input-base text-xs sm:text-sm py-2.5"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  value={prioFilter} 
                  onChange={(e) => { setPrio(e.target.value); setPage(1); }} 
                  className="input-base text-xs sm:text-sm py-2.5"
                >
                  <option value="">All Priorities</option>
                  {["Low","Medium","High","Critical"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {isFilterActive && (
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center justify-center gap-1 py-2 px-3 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors w-full md:w-auto shrink-0"
                >
                  <MdClose size={14} /> Clear Active Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid / Responsive View Layer Container */}
        <div className="card overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-sm bg-transparent md:bg-white dark:md:bg-gray-900 p-0">
          
          {/* Mobile Display Representation (Hidden above 768px) */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="card p-4 bg-white dark:bg-gray-900 animate-pulse space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-50 dark:bg-gray-800 rounded w-1/2" />
                  <div className="flex gap-2"><div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" /><div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" /></div>
                </div>
              ))
            ) : complaints.length === 0 ? (
              <EmptyState title="No system complaints found" subtitle="Try refining search keywords." />
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="card p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">#{c.id}</span>
                    <span className="text-xs text-gray-400 font-medium">{formatDate(c.created_at)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.student?.full_name} · <span className="font-mono">{c.student?.roll_number}</span></p>
                    <p className="text-xs font-semibold text-gray-400 mt-1">{c.category} • <span className="font-normal">{c.full_location}</span></p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800/60">
                    <div className="flex gap-1">
                      <PriorityBadge level={c.priority_level} />
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setSelected(c); setViewModal(true); }} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-blue-500"><MdVisibility size={16} /></button>
                      <button onClick={() => openStatusModal(c)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-green-500"><MdEdit size={16} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-rose-500"><MdDelete size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Matrix Representation (Hidden below 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  {["#","Title","Student","Category","Location","Priority","Status","Date","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(9)].map((__, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : complaints.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-sm font-medium text-gray-400">No matching system complaints logged.</td></tr>
                ) : (
                  complaints.map((c) => (
                    <motion.tr key={c.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 dark:text-gray-500 font-mono text-xs">#{c.id}</td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</p>
                        {c.reporter_count > 1 && <p className="text-[11px] font-bold text-primary-500 mt-0.5">{c.reporter_count} reporters joined</p>}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{c.student?.full_name}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{c.student?.roll_number}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{c.category}</td>
                      <td className="px-4 py-3.5 text-gray-500 max-w-[140px] truncate">{c.full_location}</td>
                      <td className="px-4 py-3.5"><PriorityBadge level={c.priority_level} /></td>
                      <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap text-xs">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => { setSelected(c); setViewModal(true); }} className="p-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-500 transition-colors" title="View Details"><MdVisibility size={18} /></button>
                          <button onClick={() => openStatusModal(c)} className="p-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 transition-colors" title="Modify Status"><MdEdit size={18} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors" title="Delete Permanent"><MdDelete size={18} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2">
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Complaint Status" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Target Entry</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{selected.title}</span>
            </div>
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider mb-1.5">New Status Select *</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-base text-sm py-2.5">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider mb-1.5">Remark Logs (Optional)</label>
              <textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={3} className="input-base text-sm resize-none" placeholder="Provide tracking summary details regarding this modification step..." />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button onClick={() => setStatusModal(false)} className="btn-secondary w-full sm:flex-1 py-2.5">Cancel</button>
              <button onClick={handleStatusUpdate} disabled={saving} className="btn-primary w-full sm:flex-1 py-2.5 justify-center">
                {saving ? "Saving Logs..." : "Commit Status Change"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Complaint Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Complaint Inspection Sheet" size="xl">
        {selected && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            
            {/* Badges Container */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <PriorityBadge level={selected.priority_level} />
                <StatusBadge status={selected.status} />
                <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20 px-2.5 py-0.5 text-xs font-bold">
                  Score Weight: {selected.priority_score}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {selected.title}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                {selected.description}
              </p>
            </div>

            {/* Structured Key-Value Property Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "Category", val: selected.category, icon: <FiTag /> },
                { label: "Location Parameters", val: selected.full_location, icon: <FiMapPin /> },
                { label: "Reporting Student", val: selected.student?.full_name, icon: <FiUser /> },
                { label: "Academic Roll Number", val: selected.student?.roll_number, icon: <FiHash /> },
                { label: "Reporter Accumulation", val: `${selected.reporter_count} user(s)`, icon: <FiUsers /> },
                { label: "Submission Horizon", val: formatDate(selected.created_at), icon: <FiCalendar /> }
              ].map((item, index) => (
                <div key={index} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <p className="mt-1.5 font-bold text-sm text-gray-900 dark:text-white truncate">
                    {item.val || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {/* Evidence Image Block */}
            {selected.image_filename && (
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <span>Submitted Evidence Attachment</span>
                    </h3>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <a 
                      href={getImageUrl(selected.image_filename)} 
                      download 
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition text-center flex-1 sm:flex-none justify-center flex items-center"
                    >
                      <FiDownload size={16} />
                    </a>
                    <a 
                      href={getImageUrl(selected.image_filename)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition text-center flex-1 sm:flex-none justify-center flex items-center gap-1 text-xs font-bold"
                    >
                      <FiExternalLink size={16} /> <span>Open Fullscreen</span>
                    </a>
                  </div>
                </div>

                <div className="flex justify-center bg-gray-950 p-4">
                  <img
                    src={getImageUrl(selected.image_filename)}
                    alt="Inspection attachment verification element"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                    className="h-44 sm:h-56 w-auto max-w-full object-contain rounded-lg cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => window.open(getImageUrl(selected.image_filename), "_blank")}
                  />
                </div>
              </div>
            )}

            {/* Footer Closer */}
            <div className="pt-2 border-t border-gray-50 dark:border-gray-800/60 flex justify-end">
              <button onClick={() => setViewModal(false)} className="btn-secondary px-6 py-2">
                Close Inspection Sheet
              </button>
            </div>

          </div>
        )}
      </Modal>

    </PageWrapper>
  );
}