import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { ClipboardPenLine, X } from "lucide-react";
import api from "../../Components/API/axiosInstance";

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const accessToken = Cookies.get("access_token");

export default function ProjectsList() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await api.get(
        `${supabaseUrl}/rest/v1/rpc/get_projects`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        toast.error("Failed to Load Projects List!");
        navigate("/login");
        return;
      }

      const projectsData = await response.data;
      setProjects(projectsData);
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching projects.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(projectId: string) {
    try {
      await api.delete(`${supabaseUrl}/rest/v1/projects?id=eq.${projectId}`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Project deleted successfully.");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error: any) {
      toast.error("Failed to delete the project!");
      setError(error.message || "An error occurred while fetching projects.");
    }
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-8 sm:p-8 md:p-10"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sm:grid grid-cols-1 gap-3 lg:flex justify-between items-center mb-6"
          >
            <h2 className="text-lg md:text-2xl font-semibold text-blue-darkBlue">
              Assigned Projects
            </h2>
            <Link
              to={"/add-new-project"}
              className="px-4 py-2 sm:max-w-[50%] bg-blue-darkBlue text-brightness-primary rounded-lg hover:bg-blue-800 transition"
            >
              Add New Project
            </Link>
          </motion.div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((x) => (
                <div
                  key={x}
                  className="h-32 w-full bg-gray-200 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          )}

          {error && <div className="text-red-800 mt-4">{error}</div>}

          {!loading && projects.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-600 text-lg mb-3">
                You don’t have any projects yet.
              </p>
              <Link
                to="/add-new-project"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create New Project
              </Link>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="px-8 py-4 bg-brightness-primary shadow-lg rounded-2xl flex justify-between items-center hover:shadow-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardPenLine size={20} className="text-gray-600" />

                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold text-blue-darkBlue mb-1">
                        {project.name}
                      </h2>

                      <p className="text-gray-500 text-xs">
                        {new Date(project.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">
                    {project.description}
                  </p>

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      rotate: 90,
                      backgroundColor: "#dc2626",
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => deleteProject(project.id)}
                    className="p-2 bg-red-400 text-white text-sm rounded-full"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
