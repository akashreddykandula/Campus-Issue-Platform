import { useState } from "react";
import Navbar from "./Navbar";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";

export default function PageWrapper({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {user?.role === "admin" ? (
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <StudentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
