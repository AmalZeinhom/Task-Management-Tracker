export default function ProjectMemberSkeleton() {
  return (
    <div className="flex justify-between items-center animate-pulse">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        <div className="flex flex-col ml-4 gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
    </div>
  );
}
