import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { loginStudent } from "../../api/authAPI";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginStudent(data);
      login(res.data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased selection:bg-primary-500/30 transition-colors duration-300">
      
      {/* Left Column: Authentic Form Matrix */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-12 md:p-20 relative z-10">
        
        {/* Top Header: Logo / Branding */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
              CampusIssue
            </span>
          </Link>
          <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
            <MdArrowBack size={14} /> Back to home
          </Link>
        </div>

        {/* Core Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] mx-auto my-auto py-12"
        >
          <div className="mb-9">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-normal">
              Please enter your campus credentials details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Roll Number Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Roll Number
              </label>
              <input
                {...register("roll_number", { required: "Roll number is required" })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl uppercase text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium tracking-wide"
                placeholder="e.g. 24HU5A0511"
              />
              {errors.roll_number && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  • {errors.roll_number.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPw ? "text" : "password"}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 pr-11 font-medium"
                  placeholder="Enter your password"
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

            {/* Remember & Options Matrix */}
            <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 select-none">
                <input 
                  type="checkbox" 
                  className="accent-primary-600 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                />
                Remember for 30 days
              </label>
              <Link to="/forgot-password" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Forgot password
              </Link>
            </div>

            {/* Action Submit Button */}
            <div className="pt-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-medium text-sm py-3.5 rounded-xl transition-all shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Third-Party Portal Link Option */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900/60 text-center text-xs sm:text-sm space-y-3">
            <p className="text-slate-500 dark:text-slate-400 font-normal">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Lower Left Admin Shortcut Footer */}
        <div className="text-center lg:text-left text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Link to="/admin/login" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1">
            Access Administrative Portal Control Entry <span className="tracking-normal">→</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Premium Interactive Abstract Visual Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-50 dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/60 overflow-hidden items-center justify-center p-12">
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[80px]" />
        
        {/* Fine Decorative Grid Vector Graphics Overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-sm text-center z-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-flex items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-200/40 dark:border-slate-800/40 mx-auto"
          >
            {/* Premium Minimalistic Mock Illustration Element */}
            <div className="space-y-2.5 w-40 text-left">
              <div className="h-2 w-16 bg-primary-500/40 dark:bg-primary-400/40 rounded-full" />
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="pt-2 flex items-center justify-between">
                <div className="h-4 w-12 bg-emerald-500/20 dark:bg-emerald-400/10 rounded-lg border border-emerald-500/30 text-[8px] font-bold text-emerald-600 text-center flex items-center justify-center">Resolved</div>
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Centralized Campus Operations
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 leading-relaxed font-normal">
            Automating diagnostic classification to ensure maintenance requests, structural fixes, and infrastructure priorities are resolved swiftly.
          </p>
        </div>
      </div>

    </div>
  );
}