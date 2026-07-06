import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdAdminPanelSettings, MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { loginAdmin } from "../../api/authAPI";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginAdmin(data);
      login(res.data.user);
      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased selection:bg-amber-500/30 transition-colors duration-300">
      
      {/* Left Column: Authoritative Admin Form Control Matrix */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-12 md:p-20 relative z-10">
        
        {/* Top Header: Structural Identity Branding */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-600 dark:bg-amber-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
              CampusIssue
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 dark:bg-slate-900 px-2 py-0.5 border border-slate-200/60 dark:border-slate-800 rounded text-slate-500 dark:text-slate-400">
              HQ Portal
            </span>
          </Link>
          <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
            <MdArrowBack size={14} /> Back to platform home
          </Link>
        </div>

        {/* Core Secure Login Form Area */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] mx-auto my-auto py-12"
        >
          <div className="mb-9">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              System Console Sign In
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-normal">
              Restricted infrastructure quadrant token control entry checkpoint. Authorized administrative personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Admin Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Administrative Email Address
              </label>
              <input 
                {...register("email", { required: "Email is required" })} 
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-amber-600 dark:focus:border-amber-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium" 
                placeholder="admin@campus.edu" 
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  • {errors.email.message}
                </p>
              )}
            </div>

            {/* Admin Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Security Password Clear Key
              </label>
              <div className="relative">
                <input 
                  {...register("password", { required: "Password is required" })} 
                  type={showPw ? "text" : "password"} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-amber-600 dark:focus:border-amber-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 pr-11 font-medium" 
                  placeholder="Admin password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  • {errors.password.message}
                </p>
              )}
            </div>

            {/* Authorization Action Control Submit Button */}
            <div className="pt-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 disabled:opacity-70 font-semibold text-sm py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  "Authenticate Identity Gateway"
                )}
              </button>
            </div>
          </form>

        </motion.div>

        {/* Lower Left Redirection Shortcuts */}
        <div className="text-center lg:text-left text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Link to="/login" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1">
            ← Route Back to Student Community Access Terminal
          </Link>
        </div>
      </div>

      {/* Right Column: Premium Administrative Command Visual Canvas */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 border-l border-slate-900 overflow-hidden items-center justify-center p-12">
        {/* Deep Authority Ambient Gold & Slate Light Fields */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-slate-500/5 blur-[80px]" />
        
        {/* Structural Interface Matrix Grid Line Overlays */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative max-w-sm text-center z-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-flex items-center justify-center p-6 bg-slate-900/60 rounded-3xl shadow-2xl shadow-black/60 border border-slate-800/40 mx-auto"
          >
            {/* System Security Interface Card Architecture Simulation */}
            <div className="space-y-3 w-44 text-left font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500">SYS_AUTH</span>
                <MdAdminPanelSettings size={14} className="text-slate-500" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-amber-500/60 rounded-full" />
                </div>
                <div className="h-1 w-5/6 bg-slate-800 rounded-full" />
                <div className="h-1 w-3/4 bg-slate-800 rounded-full" />
              </div>
              <div className="pt-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Gateway Secure
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Campus Operational Core
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-normal">
            Analyze priority engine arrays, export compliance logs, deploy resolution confirmations, and handle high-level infrastructure reports across centralized college vectors.
          </p>
        </div>
      </div>

    </div>
  );
}