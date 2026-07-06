export default function Loader({ fullScreen = false, size = "md" }) {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${sizes[size]}`} />
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center p-6">{spinner}</div>;
}
