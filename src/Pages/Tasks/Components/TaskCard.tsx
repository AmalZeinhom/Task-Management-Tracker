import { MoreHorizontal, Clock } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { formatedDate } from "@/Utils/FormatedDate";

export default function TaskCard({ task, isOverlay = false }: any) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: task,
    disabled: isOverlay // Disable dragging when it's the overlay
  });

  return (
    <div
      ref={setNodeRef}
      {...(!isOverlay ? listeners : {})}
      {...(!isOverlay ? attributes : {})}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition ${
        !isOverlay ? "hover:shadow-md cursor-grab" : "shadow-lg opacity-90"
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
        <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
      </div>

      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{task.description}</p>

      <div className="flex justify-between items-center mt-4 text-gray-400 text-xs">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatedDate(task.due_date)}</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
          AM
        </div>
      </div>
    </div>
  );
}
