import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import useProjectName from "@/hooks/useProjectName";
import { SearchIcon } from "lucide-react";
import { TaskStatus } from "@/Constants/taskStatus";
import Column from "./Components/Column";

export default function BoardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-6 px-6"
    >
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm mb-6">
        <Link to="/projects" className="text-gray-500">
          Projects /
        </Link>
        <Link to={`/projects/${projectId}`} className="text-gray-500">
          {projectName || projectId} /
        </Link>
        <span className="text-gray-700 font-medium">Tasks</span>
      </div>

      {/* Container */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex gap-4 mb-6">
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

          <select className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
            <option>Board View</option>
            <option>List View</option>
          </select>
        </div>

        {/* Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {TaskStatus.map((status) => (
            <Column key={status} status={status} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
