import { useAuth } from "../../context/AuthContext";
import PageWrapper from "../../components/layout/PageWrapper";
import { motion } from "framer-motion";
import { MdPerson, MdEmail, MdPhone, MdSchool, MdBadge, MdCalendarToday } from "react-icons/md";
import { formatDate } from "../../utils/formatters";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto animate-fade-in">
        <h1 className="page-title mb-6">My Profile</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-glow">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h2>
            <span className="mt-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
              Student
            </span>
          </div>

          {/* Details */}
          <InfoRow icon={MdBadge}       label="Roll Number"  value={user?.roll_number} />
          <InfoRow icon={MdEmail}       label="Email"        value={user?.email} />
          <InfoRow icon={MdPhone}       label="Mobile"       value={user?.mobile} />
          <InfoRow icon={MdSchool}      label="Course"       value={`${user?.course} — ${user?.branch}`} />
          <InfoRow icon={MdCalendarToday} label="Year"       value={user?.year + " Year"} />
          <InfoRow icon={MdPerson}      label="Member Since" value={formatDate(user?.created_at)} />
        </motion.div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          To update your profile, contact the admin.
        </p>
      </div>
    </PageWrapper>
  );
}
