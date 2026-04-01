import { MoreHorizontal, Clock } from "lucide-react";

export default function TaskCard({ task }: any) {
  const formattedDate = new Date(task.due_date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
        <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
      </div>

      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{task.description}</p>

      <div className="flex justify-between items-center mt-4 text-gray-400 text-xs">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formattedDate}</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
          AM
        </div>
      </div>
    </div>
  );
}
