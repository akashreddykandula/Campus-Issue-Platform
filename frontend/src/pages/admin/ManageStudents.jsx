import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdPerson, MdVisibility, MdBlock, MdCheckCircle } from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import { getAllStudents, getStudent, toggleStudent } from "../../api/adminAPI";
import { Pagination, SearchBar, EmptyState, CardSkeleton } from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import { formatDate } from "../../utils/formatters";

export default function ManageStudents() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllStudents({ page, per_page: 15, search: search || undefined });
      setStudents(res.data.students);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (_) {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleView = async (id) => {
    setDetailLoading(true);
    setViewModal(true);
    try {
      const res = await getStudent(id);
      setSelected(res.data.student);
    } catch (_) {}
    finally { setDetailLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleStudent(id);
      toast.success(res.data.message);
      fetch();
    } catch (_) { toast.error("Action failed"); }
  };

  return (
    <PageWrapper>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} registered students</p>
        </div>

        {/* Search */}
        <div className="card p-4">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, roll number, or email…" />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  {["#","Name","Roll No","Email","Course","Branch","Year","Status","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>{[...Array(9)].map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : students.length === 0 ? (
                  <tr><td colSpan={9}><EmptyState title="No students found" /></td></tr>
                ) : (
                  students.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">
                            {s.full_name[0]}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{s.roll_number}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{s.email}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.course}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.branch}</td>
                      <td className="px-4 py-3 text-gray-500">{s.year}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {s.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(s.id)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
                            title="View"
                          >
                            <MdVisibility size={17} />
                          </button>
                          <button
                            onClick={() => handleToggle(s.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              s.is_active
                                ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                                : "hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500"
                            }`}
                            title={s.is_active ? "Deactivate" : "Activate"}
                          >
                            {s.is_active ? <MdBlock size={17} /> : <MdCheckCircle size={17} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

      {/* Student Detail Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Student Details">
        {detailLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <CardSkeleton key={i} className="h-10" />)}</div>
        ) : selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {selected.full_name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.full_name}</h3>
                <p className="text-sm text-gray-500">{selected.roll_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Email",   selected.email],
                ["Mobile",  selected.mobile],
                ["Course",  selected.course],
                ["Branch",  selected.branch],
                ["Year",    selected.year],
                ["Joined",  formatDate(selected.created_at)],
                ["Total Complaints",    selected.complaint_count],
                ["Resolved Complaints", selected.resolved_count],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value ?? "—"}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </PageWrapper>
  );
}
