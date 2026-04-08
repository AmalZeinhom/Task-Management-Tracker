import { motion } from "framer-motion";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useProjectName from "@/hooks/useProjectName";
import { SearchIcon } from "lucide-react";
import { TaskStatus } from "@/Constants/taskStatus";
import Column from "./Components/Column";

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";

import api from "@/API/axiosInstance";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import TaskCard from "./Components/TaskCard";
import Selector from "@/Utils/Selector";
import ListView from "./ListView";

export default function BoardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);
  const queryClient = useQueryClient();

  const [activeTask, setActiveTask] = useState<any>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "board";

  const options = [
    { label: "Board View", value: "board" },
    { label: "List View", value: "list" }
  ];

  const selectedOption = options.find((o) => o.value === view) || null;

  function handleDragStart(event: any) {
    setActiveTask(event.active.data.current);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      const accessToken = Cookies.get("access_token");

      await api.patch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`,
        { status: newStatus },
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Task updated");

      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
    } catch (err: any) {
      toast.error("Failed to update task", err.message);
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen py-6 px-6"
      >
        <div className="flex gap-2 text-sm mb-6">
          <Link to="/projects" className="text-gray-500">
            Projects /
          </Link>
          <Link to={`/projects/${projectId}`} className="text-gray-500">
            {projectName || projectId} /
          </Link>
          <span className="text-gray-700 font-medium">Tasks</span>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-80">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tasks"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="w-80">
              <Selector
                options={options}
                value={selectedOption}
                onChange={(option) =>
                  setSearchParams({ view: option?.value?.toString() || "Board" })
                }
              />
            </div>
          </div>

          {view === "board" ? (
            <div className="flex gap-6 overflow-x-auto pb-4 overscroll-x-contain">
              {TaskStatus.map((status) => (
                <Column key={status} status={status} />
              ))}
            </div>
          ) : (
            <ListView />
          )}
        </div>
      </motion.div>

      {/* Virtual Card for Drag Overlay */}
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
    </DndContext>
  );
}
