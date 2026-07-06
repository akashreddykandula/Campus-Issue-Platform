import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import GuestRoute from "./routes/GuestRoute.jsx";
import Loader from "./components/common/Loader.jsx";

// Public
const LandingPage     = lazy(() => import("./pages/public/LandingPage.jsx"));
const NotFoundPage    = lazy(() => import("./pages/public/NotFoundPage.jsx"));

// Auth
const LoginPage       = lazy(() => import("./pages/auth/LoginPage.jsx"));
const RegisterPage    = lazy(() => import("./pages/auth/RegisterPage.jsx"));
const AdminLoginPage  = lazy(() => import("./pages/auth/AdminLoginPage.jsx"));

// Student
const StudentDashboard  = lazy(() => import("./pages/student/StudentDashboard.jsx"));
const RaiseComplaint    = lazy(() => import("./pages/student/RaiseComplaint.jsx"));
const ComplaintDetail   = lazy(() => import("./pages/student/ComplaintDetail.jsx"));
const ComplaintHistory  = lazy(() => import("./pages/student/ComplaintHistory.jsx"));
const NotificationsPage = lazy(() => import("./pages/student/NotificationsPage.jsx"));
const ProfilePage       = lazy(() => import("./pages/student/ProfilePage.jsx"));

// Admin
const AdminDashboard    = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const ManageComplaints  = lazy(() => import("./pages/admin/ManageComplaints.jsx"));
const AnalyticsPage     = lazy(() => import("./pages/admin/AnalyticsPage.jsx"));
const ManageStudents    = lazy(() => import("./pages/admin/ManageStudents.jsx"));
const SettingsPage      = lazy(() => import("./pages/admin/SettingsPage.jsx"));

export default function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/admin/login"  element={<AdminLoginPage />} />
        </Route>

        {/* Student protected */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/dashboard"              element={<StudentDashboard />} />
          <Route path="/raise-complaint"        element={<RaiseComplaint />} />
          <Route path="/complaints/:id"         element={<ComplaintDetail />} />
          <Route path="/my-complaints"          element={<ComplaintHistory />} />
          <Route path="/notifications"          element={<NotificationsPage />} />
          <Route path="/profile"               element={<ProfilePage />} />
        </Route>

        {/* Admin protected */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard"        element={<AdminDashboard />} />
          <Route path="/admin/complaints"       element={<ManageComplaints />} />
          <Route path="/admin/analytics"        element={<AnalyticsPage />} />
          <Route path="/admin/students"         element={<ManageStudents />} />
          <Route path="/admin/settings"         element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
