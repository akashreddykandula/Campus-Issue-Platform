import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { registerStudent } from "../../api/authAPI";
import { useAuth } from "../../context/AuthContext";
import { COURSES, BRANCHES, YEARS } from "../../utils/constants";

export default function RegisterPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const selectedCourse = watch("course");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerStudent(data);
      login(res.data.user);
      toast.success("Registration successful! Welcome.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const branches = selectedCourse ? BRANCHES[selectedCourse] || [] : [];
  const years    = selectedCourse ? YEARS[selectedCourse]    || [] : [];

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased selection:bg-primary-500/30 transition-colors duration-300">
      
      {/* Left Column: Register Form Section */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-12 md:px-20 md:py-10 relative z-10 overflow-y-auto max-h-screen">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
              CampusIssue
            </span>
          </Link>
          <Link to="/login" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
            <MdArrowBack size={14} /> Existing Account? Sign in
          </Link>
        </div>

        {/* Centralized Core Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] mx-auto my-auto py-6"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Create student account
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-normal">
              Join your campus community platform to quickly report and track issues.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input 
                {...register("full_name", { required: "Full name is required" })} 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium" 
                placeholder="Your full name" 
              />
              {errors.full_name && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.full_name.message}</p>}
            </div>

            {/* Grid Layout for Roll Number and Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Roll Number</label>
                <input 
                  {...register("roll_number", { required: "Roll number is required" })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl uppercase text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium tracking-wide" 
                  placeholder="e.g. 24HU5A0511" 
                />
                {errors.roll_number && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.roll_number.message}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mobile Number</label>
                <input 
                  {...register("mobile", { required: "Mobile is required", pattern: { value: /^\d{10}$/, message: "Must be 10 digits" } })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium" 
                  placeholder="10-digit mobile" 
                  maxLength={10} 
                />
                {errors.mobile && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.mobile.message}</p>}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input 
                {...register("email", { required: "Email is required" })} 
                type="email" 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium" 
                placeholder="you@example.com" 
              />
              {errors.email && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.email.message}</p>}
            </div>

            {/* Course Dropdown Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Course</label>
              <select 
                {...register("course", { required: "Course is required" })} 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 transition-all outline-none font-medium appearance-none"
              >
                <option value="" className="text-slate-400">Select course</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.course && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.course.message}</p>}
            </div>

            {/* Branch and Year Nested Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Branch</label>
                <select 
                  {...register("branch", { required: "Branch is required" })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 transition-all outline-none font-medium disabled:opacity-60 appearance-none" 
                  disabled={!selectedCourse}
                >
                  <option value="">Select branch</option>
                  {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.branch && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.branch.message}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Year</label>
                <select 
                  {...register("year", { required: "Year is required" })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 transition-all outline-none font-medium disabled:opacity-60 appearance-none" 
                  disabled={!selectedCourse}
                >
                  <option value="">Select year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.year.message}</p>}
              </div>
            </div>

            {/* Passwords Flex Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} 
                    type={showPw ? "text" : "password"} 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 pr-10 font-medium" 
                    placeholder="Min 6 characters" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <input 
                  {...register("confirm_password", { required: "Please confirm your password" })} 
                  type="password" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 focus:border-primary-600 dark:focus:border-primary-500 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium" 
                  placeholder="Re-enter password" 
                />
                {errors.confirm_password && <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">• {errors.confirm_password.message}</p>}
              </div>
            </div>

            {/* Action Register Button */}
            <div className="pt-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-medium text-sm py-3.5 rounded-xl transition-all shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

        </motion.div>

        {/* Form Bottom Link Option */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-normal shrink-0 mt-4">
          Already have a registration set up?{" "}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>

      {/* Right Column: Premium Side Artwork Panel matched to Login Layout */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-50 dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/60 overflow-hidden items-center justify-center p-12 max-h-screen sticky top-0">
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-sm text-center z-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-flex items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-200/40 dark:border-slate-800/40 mx-auto"
          >
            <div className="space-y-2.5 w-40 text-left">
              <div className="h-2 w-12 bg-primary-500/40 dark:bg-primary-400/40 rounded-full" />
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="pt-2 flex items-center justify-between">
                <div className="h-4 w-14 bg-primary-500/20 dark:bg-primary-400/10 rounded-lg border border-primary-500/30 text-[8px] font-bold text-primary-600 text-center flex items-center justify-center">Auto-Priority</div>
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Transparent Issue Tracking
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 leading-relaxed font-normal">
            Gain immediate insight into systemic prioritizations. Submit infrastructure concerns with custom photos and trace updates from pending to verified completion.
          </p>
        </div>
      </div>

    </div>
  );
}