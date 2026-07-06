import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowBack, MdLocationOn, MdCategory, MdHistory } from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import { getComplaint, getImageUrl } from "../../api/complaintAPI";
import { StatusBadge, PriorityBadge } from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import { formatDateTime } from "../../utils/formatters";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getComplaint(id)
      .then((res) => setComplaint(res.data.complaint))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageWrapper><Loader /></PageWrapper>;
  if (!complaint) return <PageWrapper><p className="text-gray-500">Complaint not found.</p></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto animate-fade-in space-y-5">
        <Link to="/my-complaints" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <MdArrowBack size={18} /> Back to My Complaints
        </Link>

        <div className="card p-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{complaint.title}</h1>
            <div className="flex gap-2">
              <PriorityBadge level={complaint.priority_level} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{complaint.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
            <div className="flex items-center gap-2 text-gray-500">
              <MdCategory size={18} className="text-primary-500" />
              <span>{complaint.category}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MdLocationOn size={18} className="text-primary-500" />
              <span>{complaint.full_location}</span>
            </div>
            <div className="text-gray-500">
              <span className="font-medium text-gray-700 dark:text-gray-300">Score: </span>
              {complaint.priority_score}
            </div>
            <div className="text-gray-500">
              <span className="font-medium text-gray-700 dark:text-gray-300">Reporters: </span>
              {complaint.reporter_count}
            </div>
            <div className="text-gray-500 col-span-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Submitted: </span>
              {formatDateTime(complaint.created_at)}
            </div>
          </div>

          {complaint.image_filename && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attached Image</p>
              <img src={getImageUrl(complaint.image_filename)} alt="Complaint" className="max-h-72 rounded-xl object-cover border border-gray-100 dark:border-gray-800" />
            </div>
          )}

          {complaint.assignment && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm border border-blue-100 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-200">Assigned to: {complaint.assignment.admin_name}</p>
              {complaint.assignment.note && <p className="text-blue-600 dark:text-blue-300 mt-1">{complaint.assignment.note}</p>}
            </div>
          )}
        </div>

        {/* History */}
        {complaint.history?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MdHistory size={20} className="text-primary-500" /> Status History
            </h2>
            <div className="space-y-3">
              {complaint.history.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{h.new_status}</span>
                      {h.old_status && <span className="text-gray-400"> (was {h.old_status})</span>}
                    </p>
                    {h.remark && <p className="text-xs text-gray-500 mt-0.5">{h.remark}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(h.changed_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
