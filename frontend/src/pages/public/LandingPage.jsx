import {useState} from 'react';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
  MdFlashOn,
  MdSecurity,
  MdBarChart,
  MdNotifications,
  MdSearch,
  MdDownload,
  MdArrowForward,
  MdKeyboardArrowDown,
  MdMenu,
  MdClose,
} from 'react-icons/md';
import {useTheme} from '../../context/ThemeContext';
import {MdDarkMode, MdLightMode} from 'react-icons/md';

const features = [
  {
    icon: MdFlashOn,
    title: 'Smart Priority Engine',
    desc: 'AI-powered keyword analysis auto-assigns Low / Medium / High / Critical priority to every complaint.',
  },
  {
    icon: MdSearch,
    title: 'Duplicate Detection',
    desc: 'RapidFuzz NLP detects similar complaints so reporters can join existing issues instead of creating noise.',
  },
  {
    icon: MdNotifications,
    title: 'Real-time Notifications',
    desc: 'Students receive instant updates when their complaint status changes or is resolved.',
  },
  {
    icon: MdBarChart,
    title: 'Analytics Dashboard',
    desc: 'Admins get charts for monthly trends, category breakdown, top locations, and resolution time.',
  },
  {
    icon: MdSecurity,
    title: 'Role-based Access',
    desc: 'Separate portals for students and admins with protected routes and session-based authentication.',
  },
  {
    icon: MdDownload,
    title: 'Export Reports',
    desc: 'Download full complaint data as CSV for offline analysis or official records.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Register',
    desc: 'Students sign up with their roll number, course, and branch.',
  },
  {
    num: '02',
    title: 'Raise Complaint',
    desc: 'Choose category, location, and describe the issue — optionally attach a photo.',
  },
  {
    num: '03',
    title: 'Auto Priority',
    desc: 'The system scores and assigns a priority level within seconds.',
  },
  {
    num: '04',
    title: 'Track & Resolve',
    desc: 'Follow real-time status updates from Pending to Resolved.',
  },
];

const stats = [
  {value: '500+', label: 'Complaints Handled'},
  {value: '98%', label: 'Resolution Rate'},
  {value: '< 2h', label: 'Avg. Critical Response'},
  {value: '13', label: 'Complaint Categories'},
];

const faqs = [
  {
    q: 'Who can use this platform?',
    a: 'Any enrolled student with a valid roll number can register and raise complaints.',
  },
  {
    q: 'How is priority assigned?',
    a: 'Our keyword engine scans your complaint title and description and assigns a score — the higher the score, the higher the priority.',
  },
  {
    q: 'What happens to duplicate issues?',
    a: "You'll be notified of a similar existing complaint and can join it, increasing the reporter count for that issue.",
  },
  {
    q: 'Can I upload images?',
    a: 'Yes — jpg, jpeg, and png files up to 5 MB are supported.',
  },
  {
    q: 'How do I track my complaint status?',
    a: "Visit 'My Complaints' in your dashboard. You'll also receive in-app notifications on every status change.",
  },
];

export default function LandingPage () {
  const {theme, toggleTheme} = useTheme ();
  const [openFaq, setOpenFaq] = useState (null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState (false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased selection:bg-primary-500/30 transition-colors duration-500 relative overflow-x-hidden">

      {/* GLOBAL BACKGROUND ENHANCEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.4] dark:opacity-[0.25] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] rounded-full bg-primary-400/20 dark:bg-primary-600/10 blur-[80px] sm:blur-[140px] animate-pulse [animation-duration:8s]" />
        <div className="absolute top-[20%] right-[-20%] w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-600/5 blur-[70px] sm:blur-[120px] animate-pulse [animation-duration:12s]" />
      </div>

      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-900 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary-600 animate-pulse" />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
            CampusIssue
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200 shadow-sm"
          >
            {theme === 'dark'
              ? <MdLightMode size={18} />
              : <MdDarkMode size={18} />}
          </button>
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
          >
            Student Login
          </Link>
          <Link
            to="/admin/login"
            className="text-sm font-medium bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-gray-950 px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Control Trigger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 text-slate-600 dark:text-slate-400"
          >
            {theme === 'dark'
              ? <MdLightMode size={18} />
              : <MdDarkMode size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen (!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen &&
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className="fixed inset-x-0 top-[65px] p-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-900 z-40 md:hidden flex flex-col gap-3 shadow-xl"
          >
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen (false)}
              className="w-full text-center py-3 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900"
            >
              Student Login
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen (false)}
              className="w-full text-center py-3 rounded-xl font-medium text-white bg-slate-900 dark:bg-slate-800"
            >
              Admin Dashboard Login
            </Link>
          </motion.div>}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 text-center z-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: 'easeOut'}}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-full text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 shadow-sm backdrop-blur-md">
            🎓 Built for Modern Campus Communities
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 text-slate-900 dark:text-white">
            Campus Issue Management<br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-500 to-blue-500 dark:from-primary-400 dark:via-indigo-400 dark:to-blue-400">
              Turned Fluid & Transparent
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
            Raise, track, and resolve college complaints — from minor facilities maintenance to critical safety hazards — with smart priority detection engines and real-time transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-primary-600/10 transition-all duration-200"
            >
              Get Started Free <MdArrowForward size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/80 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/60 font-medium text-sm px-6 sm:px-8 py-3.5 rounded-xl backdrop-blur-md transition-all shadow-sm"
            >
              Student Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Premium Minimal Stats */}
      <section className="relative z-10 border-y border-slate-200/50 dark:border-slate-900 bg-white/40 dark:bg-slate-900/10 py-10 sm:py-14 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center">
          {stats.map (s => (
            <motion.div
              key={s.label}
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              viewport={{once: true}}
            >
              <div className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mt-1 sm:mt-2">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              Engineered for Efficiency
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400">
              Everything required to streamline automation across student and admin teams seamlessly.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map ((f, i) => (
              <motion.div
                key={f.title}
                initial={{opacity: 0, y: 15}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{delay: i * 0.05}}
                className="group relative p-5 sm:p-6 bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl backdrop-blur-md shadow-sm hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-300"
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 group-hover:bg-primary-500 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4 sm:mb-5">
                  <f.icon size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 tracking-tight text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 border-t border-slate-200/40 dark:border-slate-900/50 bg-slate-100/30 dark:bg-slate-950/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              How it Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Four simple milestones from cataloging an architectural hazard to complete resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map ((s, i) => (
              <motion.div
                key={s.num}
                initial={{opacity: 0, y: 15}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{delay: i * 0.08}}
                className="relative"
              >
                <div className="text-5xl sm:text-6xl font-black text-slate-300/50 dark:text-slate-800/30 font-mono tracking-tighter mb-1 sm:bg-transparent">
                  {s.num}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 tracking-tight text-sm sm:text-base">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Accordion FAQ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 border-t border-slate-200/40 dark:border-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white mb-10 sm:mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map ((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white/70 dark:bg-slate-900/20 overflow-hidden backdrop-blur-md transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq (isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-xs sm:text-base text-slate-900 dark:text-white hover:bg-white/90 dark:hover:bg-slate-900/40 transition-colors gap-3"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{rotate: isOpen ? 180 : 0}}
                      transition={{duration: 0.2}}
                      className="text-slate-400 shrink-0"
                    >
                      <MdKeyboardArrowDown size={20} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen &&
                      <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.25, ease: 'easeInOut'}}
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/10">
                          {faq.a}
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative text-center border-t border-slate-200/40 dark:border-slate-900/60 overflow-hidden bg-slate-950 text-white z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:3rem_3rem]" />

        <motion.div
          initial={{opacity: 0, y: 15}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="relative max-w-2xl mx-auto z-10"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to Modernize Your Campus?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
            Join your community on a faster, completely transparent administrative issue pipeline.
          </p>
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 font-semibold text-sm px-6 sm:px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-xl"
          >
            Register Now <MdArrowForward size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 border-t border-slate-900/60 py-8 sm:py-12 text-center text-[11px] sm:text-xs px-4 sm:px-6 relative z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p>
            © 2026 Campus Issue Management Platform. Any queries? Mail to akashreddykandula@gmail.com
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 font-medium">
            <Link
              to="/login"
              className="hover:text-slate-300 transition-colors"
            >
              Student Login
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-slate-300 transition-colors"
            >
              Admin Login
            </Link>
            <Link
              to="/register"
              className="hover:text-slate-300 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
