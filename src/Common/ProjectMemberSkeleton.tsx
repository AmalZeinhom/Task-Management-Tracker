export default function ProjectMemberSkeleton() {
  return (
    <div className="flex justify-between items-center animate-pulse gap-4 flex-wrap">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>

        <div className="flex flex-col ml-0 sm:ml-4 gap-2 min-w-0">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded truncate"></div>
        </div>
      </div>
      <div className="h-9 w-24 sm:w-28 bg-gray-300 rounded-md flex-shrink-0"></div>
    </div>
  );
}
