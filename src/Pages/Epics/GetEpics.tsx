import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi";
import { IoMdMore } from "react-icons/io";
import { CiCalendar, CiEdit } from "react-icons/ci";
import { useEpics } from "@/customHooks/useEpics";
import { useState } from "react";
import { Epic } from "@/Components/Types/Epic";
import { Modal } from "@/Components/Common/Modal";
import { EpicDetails } from "@/Pages/Epics/EpicDetails";
import { UpdateEpicModal } from "@/Components/Common/UpdateEpicModal";

export default function GetEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const { epics, loading, error, refetch } = useEpics(projectId);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);

  const handleUpdatedEpics = async () => {
    await refetch();
  };

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
              {projectId} /
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

        {error && <div className="text-center text-red-500 mt-6">{error}</div>}

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((x) => (
              <div key={x} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {!loading && epics.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-600 text-lg mb-3">You don’t have any Epics yet.</p>
            <Link
              to={`/projects/${projectId}/epics/new`}
              className="px-4 py-2 bg-blue-darkBlue text-white rounded-lg hover:bg-cyan-800 transition"
            >
              Create New Epic
            </Link>
          </div>
        )}

        {!loading && epics.length > 0 && (
          <div className="flex flex-col gap-6">
            {epics.map((epic) => (
              <div
                key={epic.id}
                onClick={() => {
                  setSelectedEpic(epic);
                  setIsDetailsOpen(true);
                  setIsUpdateOpen(false);
                }}
              >
                <div className="bg-brightness-primary rounded-xl shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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

                    <div className="relative flex items-center gap-6">
                      <IoMdMore
                        size={24}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropDown(openDropDown === epic.id ? null : epic.id);
                        }}
                      />

                      {openDropDown === epic.id && (
                        <motion.ul
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute right-0 top-6 w-36 rounded shadow-lg z-20"
                        >
                          <li
                            className="px-4 py-2 rounded-lg bg-blue-darkBlue text-white cursor-pointer flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEpic(epic);
                              setIsUpdateOpen(true);
                              setIsDetailsOpen(false);
                              setOpenDropDown(null);
                            }}
                          >
                            <CiEdit size={20} />
                            Edit
                          </li>
                        </motion.ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Modal
              isOpen={isDetailsOpen}
              onClose={() => {
                setSelectedEpic(null);
                setIsDetailsOpen(false);
              }}
            >
              {selectedEpic && <EpicDetails epic={selectedEpic} />}
            </Modal>

            <UpdateEpicModal
              epic={selectedEpic}
              isOpen={isUpdateOpen}
              onClose={() => setIsUpdateOpen(false)}
              onSuccess={handleUpdatedEpics}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
