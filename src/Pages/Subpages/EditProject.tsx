import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../Components/API/axiosInstance";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const accessToken = Cookies.get("access_token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const response = await api.get(`${supabaseUrl}/rest/v1/projects?id=eq.${projectId}`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.data.length > 0) {
          const project = response.data[0];
          setTitle(project.name);
          setDescription(project.description);
        }
      } catch (error: any) {
        toast.error("Failed to load project data");
        console.log(error);
      }
    }

    fetchProjectData();
  }, [projectId]);

  async function updateProjectData(e: any) {
    e.preventDefault();

    try {
      const response = await api.patch(
        `${supabaseUrl}/rest/v1/projects?id=eq.${projectId}`,
        {
          name: title,
          description
        },
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 401) {
        toast.error("Something Went Wrong!");
      }
      toast.success("Project Updated Successfully.");
      navigate("/projects-list");
    } catch (error: any) {
      toast.error("Update failed!");
      console.log(error);
    }
  }
  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-8 sm:p-8 md:p-10"
      >
        <div className="flex flex-wrap gap-2 mx-auto mb-6 text-sm">
          <Link to={"/projects-list"} className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>
          <span className="cursor-pointer text-gray-500 hover:text-gray-700">Edit Project</span>
        </div>

        <form
          className="w-full bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-2xl shadow-2xl"
          noValidate
          onSubmit={updateProjectData}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-darkBlue mb-6 text-center">
            Edit Project
          </h2>

          <label htmlFor="project-title"> Project Title</label>
          <input
            type="text"
            id="project-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full min-h-11 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />

          <label htmlFor="project-description"> Project Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-28 sm:min-h-32 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />
          <div className="flex gap-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-darkBlue text-white w-full sm:w-auto font-semibold px-6 py-2 rounded-xl shadow-2xl hover:bg-cyan-800 transition-colors duration-300"
            >
              Save
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/projects-list")}
              className="bg-blue-lightBlue text-white w-full sm:w-auto font-semibold px-6 py-2 rounded-xl shadow-2xl hover:bg-cyan-800 transition-colors duration-300"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
