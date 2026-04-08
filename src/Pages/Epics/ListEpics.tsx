import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import { useEpics } from "@/hooks/useEpics";
import { useState, useEffect } from "react";
import { Epic } from "@/Types/Epic";
import EpicsModal from "@/Pages/Epics/EpicsModal";
import useProjectName from "@/hooks/useProjectName";
import Pagination from "@/Utils/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/axiosInstance";

export default function ListEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { epics, isLoading, isError, totalCount } = useEpics(projectId, currentPage, limit); //? First data source for epics from API
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null); // Control the open/close state of the modal and store the selected epic's data for details view.

  const totalPages = Math.ceil(totalCount / limit);

  // Reset to first page when projectId changes to prevent showing empty state if the new project has fewer pages than the previous one
  useEffect(() => {
    setCurrentPage(1);
  }, [projectId]);

  const updateEpicMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      return api.patch(`/rest/v1/project_epics?id=eq.${selectedEpic?.id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epics"] });
      setSelectedEpic(null); // يقفل الـ modal بعد التعديل
    }
  });

  if (isError) {
    return <p className="text-red-500">Failed to load Epics</p>;
  }

  if (isLoading) {
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((x) => (
        <div key={x} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>;
  }

  if (!isLoading && epics.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-gray-600 text-lg mb-3">No epics found for this project.</p>
        <Link
          to={`/projects/${projectId}/epics/new`}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create New Epic
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto bg-brightness-light rounded-2xl p-6 sm:p-8 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/projects" className="text-gray-500 hover:text-gray-700">
              Projects /
            </Link>
            <Link to={`/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
              {projectName || projectId} /
            </Link>
            <span className="text-gray-700 font-medium">Epics</span>
          </div>

          <Link
            to={`/projects/${projectId}/epics/new`}
            className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition w-full sm:w-auto text-center"
          >
            + Create New Epic
          </Link>
        </motion.div>

        {!isLoading && epics.length > 0 && (
          <div className="flex flex-col gap-6">
            {epics.map((epic) => (
              <div key={epic.id} onClick={() => setSelectedEpic(epic)}>
                <div className="bg-brightness-primary rounded-xl shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:cursor-pointer transition">
                  <div className="flex flex-wrap items-center gap-6">
                    <HiOutlineLightBulb size={24} />
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-sm">{epic.title}</p>

                      <div className="flex items-center gap-3 text-xs">
                        <p># {epic.epic_id}</p>
                        <p>
                          Opened by <span className="font-bold">{epic.created_by.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs font-bold text-darkness-iconList">Created At</p>
                      <span className="flex items-center gap-1">
                        <CiCalendar />
                        <p className="text-gray-700 font-medium">
                          {new Date(epic.created_at).toLocaleDateString("en-GB")}
                        </p>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-gray-300 text-gray-600 w-10 h-10 flex items-center justify-center font-bold">
                        {/* for ensure that the name is not Undefined */}
                        {epic.assignee?.name
                          ?.split(" ")
                          .map((word) => word.charAt(0))
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <p className="font-bold text-gray-500">
                        {epic.assignee?.name ?? "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <EpicsModal
          epic={selectedEpic}
          onClose={() => setSelectedEpic(null)}
          onUpdate={(updatedFields: any) => {
            updateEpicMutation.mutate(updatedFields);
          }}
        />
      </motion.div>
    </div>
  );
}
