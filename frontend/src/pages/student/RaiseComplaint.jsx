import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MdCloudUpload, MdWarning, MdCheckCircle, MdClose, MdArrowBack } from "react-icons/md";
import PageWrapper from "../../components/layout/PageWrapper";
import { createComplaint, checkDuplicate, joinComplaint } from "../../api/complaintAPI";
import { CATEGORIES, PREDEFINED_LOCATIONS } from "../../utils/constants";
import Modal from "../../components/common/Modal";

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [dupModalOpen, setDupModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef();
  const pendingFormData = useRef(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const selectedLocation = watch("location");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      toast.error("Image must be under 5 MB"); 
      return; 
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  const submitComplaint = async (formData) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      await createComplaint(fd);
      toast.success("Complaint submitted successfully!");
      navigate("/my-complaints");
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await checkDuplicate({
        title: data.title, category: data.category, location: data.location,
      });
      if (res.data.found) {
        setDuplicates(res.data.duplicates);
        pendingFormData.current = data;
        setDupModalOpen(true);
        return;
      }
    } catch (_) {}
    await submitComplaint(data);
  };

  const handleContinueAnyway = async () => {
    setDupModalOpen(false);
    if (pendingFormData.current) await submitComplaint(pendingFormData.current);
  };

  const handleJoin = async (originalId, similarity) => {
    setDupModalOpen(false);
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(pendingFormData.current).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await createComplaint(fd);
      await joinComplaint(originalId, { duplicate_id: res.data.complaint.id, similarity });
      toast.success("Joined existing complaint as a reporter!");
      navigate("/my-complaints");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to join complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-1 sm:px-0 space-y-6">
        
        {/* Header Action Row */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Go back"
          >
            <MdArrowBack size={22} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Raise a Complaint
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              Describe your issue and we will prioritize it appropriately.
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Main Inputs (Takes up 2 cols on Desktop) */}
          <div className="card p-5 sm:p-6 space-y-5 md:col-span-2 border border-gray-100 dark:border-gray-800/60 shadow-sm">
            {/* Title */}
            <div>
              <label className="label text-xs sm:text-sm font-semibold tracking-wide">Complaint Title *</label>
              <input 
                {...register("title", { required: "Title is required", minLength: { value: 10, message: "At least 10 characters" } })} 
                className="input-base text-sm sm:text-base py-2.5 sm:py-3" 
                placeholder="e.g., Electrical sparking near panel in Lab 3" 
              />
              {errors.title && <p className="text-red-500 font-medium text-xs mt-1.5">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label text-xs sm:text-sm font-semibold tracking-wide">Description *</label>
              <textarea 
                {...register("description", { required: "Description is required", minLength: { value: 20, message: "At least 20 characters" } })} 
                rows={4} 
                className="input-base text-sm sm:text-base resize-none py-2.5 sm:py-3" 
                placeholder="Provide distinct, helpful details about the issue..." 
              />
              {errors.description && <p className="text-red-500 font-medium text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            {/* Categories & Location Flex-Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs sm:text-sm font-semibold tracking-wide">Category *</label>
                <select {...register("category", { required: "Category is required" })} className="input-base text-sm sm:text-base py-2.5 sm:py-3">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 font-medium text-xs mt-1.5">{errors.category.message}</p>}
              </div>

              <div>
                <label className="label text-xs sm:text-sm font-semibold tracking-wide">Location *</label>
                <select {...register("location", { required: "Location is required" })} className="input-base text-sm sm:text-base py-2.5 sm:py-3">
                  <option value="">Select location</option>
                  {PREDEFINED_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <p className="text-red-500 font-medium text-xs mt-1.5">{errors.location.message}</p>}
              </div>
            </div>

            {/* Custom location */}
            <AnimatePresence>
              {selectedLocation === "Others" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="label text-xs sm:text-sm font-semibold tracking-wide">Custom Location *</label>
                    <input 
                      {...register("custom_location", { required: selectedLocation === "Others" ? "Please specify the location" : false })} 
                      className="input-base text-sm sm:text-base py-2.5 sm:py-3" 
                      placeholder="e.g., Room 205, Near Lift, Behind Library..." 
                    />
                    {errors.custom_location && <p className="text-red-500 font-medium text-xs mt-1.5">{errors.custom_location.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Media Attachments & Actions Sticky Panel */}
          <div className="md:sticky md:top-6 space-y-4">
            <div className="card p-5 border border-gray-100 dark:border-gray-800/60 shadow-sm">
              <label className="label text-xs sm:text-sm font-semibold tracking-wide mb-3 block">Attach Image (Optional)</label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragging 
                    ? "border-primary-500 bg-primary-50/30 dark:bg-primary-950/10 scale-[1.01]" 
                    : "border-gray-200 dark:border-gray-700/80 hover:border-primary-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                }`}
              >
                {imagePreview ? (
                  <div className="relative group/img">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-cover shadow-sm" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                      className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow hover:bg-rose-600 transition-colors"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    <MdCloudUpload size={38} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Click or Drag Image</p>
                    <p className="text-[11px] text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} className="hidden" />
            </div>

            {/* Actions Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3.5 sm:py-3 text-base font-bold shadow-md shadow-primary-500/10 active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Responsive Duplicate Modal */}
      <Modal isOpen={dupModalOpen} onClose={() => setDupModalOpen(false)} title="Similar Complaints Found" size="md">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-900/30">
            <MdWarning size={22} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
              We found similar existing complaints. You can join one to scale visibility, or continue with your separate submission.
            </p>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {duplicates.map((d) => (
              <div key={d.complaint_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{d.title}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                    Similarity: <span className="text-amber-600 dark:text-amber-400 font-semibold">{d.similarity}%</span> · Reporters: {d.reporter_count}
                  </p>
                </div>
                <button
                  onClick={() => handleJoin(d.complaint_id, d.similarity)}
                  className="btn-primary text-xs px-3.5 py-2 w-full sm:w-auto justify-center flex items-center gap-1.5 shrink-0"
                >
                  <MdCheckCircle size={14} /> Join
                </button>
              </div>
            ))}
          </div>

          {/* Modal Action Footer buttons stack on small devices */}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <button onClick={() => setDupModalOpen(false)} className="btn-secondary w-full sm:flex-1 py-2.5">
              Cancel
            </button>
            <button onClick={handleContinueAnyway} className="btn-primary w-full sm:flex-1 py-2.5 justify-center">
              Submit Anyway
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}