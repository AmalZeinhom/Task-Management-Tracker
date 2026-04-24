import { useNavigate, useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import api from "@/API/axiosInstance";
import { PlusIcon } from "lucide-react";
import { statusColors } from "@/Constants/statusColors";
import { useQuery } from "@tanstack/react-query";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ status }: { status: string }) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { setNodeRef } = useDroppable({
    id: status
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/rest/v1/project_tasks`, {
        params: {
          project_id: `eq.${projectId}`,
          status: `eq.${status}`
        }
      });

      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", projectId, status],
    queryFn: fetchTasks
  });

  return (
    <div
      ref={setNodeRef}
      className="w-80 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200"
    >
      <div className={`px-4 py-2 rounded-t-xl text-sm font-semibold ${statusColors[status]}`}>
        {status.replaceAll("_", " ")}
      </div>

      <div className="p-3">
        <button
          onClick={() => navigate(`/projects/${projectId}/tasks/new?status=${status}`)}
          className="w-full border-2 border-dashed border-blue-400 rounded-md py-2 flex justify-center hover:bg-blue-50 transition"
        >
          <PlusIcon size={18} className="text-blue-500" />
        </button>
      </div>

      <div className="px-3 pb-4 space-y-3 max-h-[500px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No tasks</p>
        ) : (
          tasks.map((task: any) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
