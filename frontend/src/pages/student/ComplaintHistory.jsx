import {useEffect, useState, useCallback} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
  MdAddCircle,
  MdFilterList,
  MdChevronRight,
  MdClose,
} from 'react-icons/md';
import PageWrapper from '../../components/layout/PageWrapper';
import {getComplaints} from '../../api/complaintAPI';
import {StatusBadge, PriorityBadge} from '../../components/common/StatusBadge';
import {
  Pagination,
  SearchBar,
  EmptyState,
  CardSkeleton,
} from '../../components/common/Pagination';
import {formatDate} from '../../utils/formatters';
import {CATEGORIES, STATUSES} from '../../utils/constants';

export default function ComplaintHistory () {
  const [searchParams] = useSearchParams ();
  const [complaints, setComplaints] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [page, setPage] = useState (1);
  const [pages, setPages] = useState (1);
  const [total, setTotal] = useState (0);
  const [search, setSearch] = useState ('');
  const [statusFilter, setStatus] = useState (
    searchParams.get ('status') || ''
  );
  const [catFilter, setCat] = useState ('');
  const [showMobileFilters, setShowMobileFilters] = useState (false);

  const fetchComplaints = useCallback (
    async () => {
      setLoading (true);
      try {
        const res = await getComplaints ({
          page,
          per_page: 10,
          status: statusFilter || undefined,
          category: catFilter || undefined,
        });
        setComplaints (res.data.complaints);
        setPages (res.data.pages);
        setTotal (res.data.total);
      } catch (err) {
        console.error ('Failed to fetch complaints:', err);
      } finally {
        setLoading (false);
      }
    },
    [page, statusFilter, catFilter]
  );

  useEffect (
    () => {
      fetchComplaints ();
    },
    [fetchComplaints]
  );

  // Client side search text refinement layer over the paginated array
  const filtered = complaints.filter (
    c =>
      !search ||
      c.title.toLowerCase ().includes (search.toLowerCase ()) ||
      c.category.toLowerCase ().includes (search.toLowerCase ())
  );

  const hasActiveFilters = statusFilter || catFilter;

  const clearFilters = () => {
    setStatus ('');
    setCat ('');
    setPage (1);
  };

  return (
    <PageWrapper>
      <div className="space-y-5 max-w-5xl mx-auto px-1 sm:px-0 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              My Complaints
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {total} complaint{total !== 1 ? 's' : ''} recorded
            </p>
          </div>
          <Link
            to="/raise-complaint"
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm py-3 sm:py-2.5 transition-all active:scale-95 shrink-0"
          >
            <MdAddCircle size={20} /> <span>Raise Complaint</span>
          </Link>
        </div>

        {/* Search and Filters Strip */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search complaints..."
              />
            </div>

            {/* Desktop-hidden/Mobile-visible Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters (!showMobileFilters)}
              className={`sm:hidden p-3 rounded-xl border transition-all flex items-center justify-center relative ${hasActiveFilters ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950/20' : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900'}`}
              aria-label="Toggle Filters"
            >
              <MdFilterList size={22} />
              {hasActiveFilters &&
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />}
            </button>
          </div>

          {/* Desktop Filters / Expandable Mobile Panel */}
          <div
            className={`sm:flex gap-3 p-4 card border border-gray-100 dark:border-gray-800/60 shadow-sm ${showMobileFilters ? 'flex flex-col' : 'hidden'}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="grid grid-cols-1 sm:flex gap-3 flex-1 w-full">
                <select
                  value={statusFilter}
                  onChange={e => {
                    setStatus (e.target.value);
                    setPage (1);
                  }}
                  className="input-base text-sm py-2.5 sm:w-48"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map (s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={catFilter}
                  onChange={e => {
                    setCat (e.target.value);
                    setPage (1);
                  }}
                  className="input-base text-sm py-2.5 sm:w-48"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map (c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {hasActiveFilters &&
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center justify-center gap-1 py-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdClose size={14} /> Clear Filters
                </button>}
            </div>
          </div>
        </div>

        {/* Complaints Data Feed */}
        {loading
          ? <div className="space-y-3">
              {[...Array (4)].map ((_, i) => <CardSkeleton key={i} />)}
            </div>
          : filtered.length === 0
              ? <EmptyState
                  title="No complaints found"
                  subtitle="Try adjusting your current filter values or search queries."
                  icon={<MdFilterList size={44} className="text-gray-400" />}
                />
              : <div className="space-y-3">
                  {filtered.map ((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: i * 0.03}}
                    >
                      <Link
                        to={`/complaints/${c.id}`}
                        className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 dark:border-gray-800/50 hover:border-primary-100 dark:hover:border-primary-900/30 hover:shadow-sm transition-all group block"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {c.title}
                            </p>
                            {c.is_duplicate &&
                              <span className="text-[10px] sm:text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-100 dark:border-amber-900/20 shrink-0">
                                Duplicate
                              </span>}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {c.category}
                            </span>
                            <span className="text-gray-300 dark:text-gray-700">
                              •
                            </span>
                            <span className="truncate max-w-[150px] sm:max-w-none">
                              {c.full_location}
                            </span>
                            <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">
                              •
                            </span>
                            <span className="w-full sm:w-auto mt-0.5 sm:mt-0 text-gray-400">
                              {formatDate (c.created_at)}
                            </span>
                          </p>

                          {c.reporter_count > 1 &&
                            <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1.5 flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                              {c.reporter_count} students joined this issue
                            </p>}
                        </div>

                        {/* Actions & Status Layer (Responsive alignment) */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t border-gray-50 dark:border-gray-800/40 sm:border-t-0 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <PriorityBadge level={c.priority_level} />
                            <StatusBadge status={c.status} />
                          </div>
                          <MdChevronRight
                            size={20}
                            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors hidden sm:block ml-1"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>}

        {/* Footer Pagination Strip */}
        <div className="pt-2">
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </PageWrapper>
  );
}
