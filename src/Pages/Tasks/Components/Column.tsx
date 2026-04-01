import { useNavigate, useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import api from "@/API/axiosInstance";
import { PlusIcon } from "lucide-react";
import { statusColors } from "@/Constants/statusColors";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function Column({ status }: { status: string }) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      toast.error("User not authenticated!");
      return;
    }

    try {
      const res = await api.get(`${supabaseUrl}/rest/v1/project_tasks`, {
        params: {
          project_id: `eq.${projectId}`,
          status: `eq.${status}`
        },
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", projectId, status],
    queryFn: fetchTasks
  });

  return (
    <div className="w-80 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200">
      {/* Header */}
      <div className={`px-4 py-2 rounded-t-xl text-sm font-semibold ${statusColors[status]}`}>
        {status.replaceAll("_", " ")}
      </div>

      {/* Add button */}
      <div className="p-3">
        <button
          onClick={() => navigate(`/projects/${projectId}/tasks/new?status=${status}`)}
          className="w-full border-2 border-dashed border-blue-400 rounded-md py-2 flex justify-center hover:bg-blue-50 transition"
        >
          <PlusIcon size={18} className="text-blue-500" />
        </button>
      </div>

      {/* Tasks */}
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
