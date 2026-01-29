import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProjectMemberSkeleton from "../Components/Common/ProjectMemberSkeleton";
import api from "../Components/API/axiosInstance";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ProjectMembers() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [members, setMembers] = React.useState([]);

  const { projectId } = useParams();

  const isEmpty = !isLoading && members.length === 0;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  const fetchProjectMembers = async () => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        toast.error("Member Not Authorized!");
        setIsLoading(false);
        return;
      }

      const response = await api.get(
        `${supabaseUrl}/rest/v1/get_project_members?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = response.data;

      setMembers(data);
    } catch (error: any) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    fetchProjectMembers();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="mt-20">
        <ProjectMemberSkeleton />
        <ProjectMemberSkeleton />
        <ProjectMemberSkeleton />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-brightness-light rounded-lg mt-20 p-10 shadow-md">
        <div className="w-full flex justify-center flex-col items-center bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">No Members Found</h2>
          <p className="text-gray-600 mb-6">No members in this project yet.</p>
          <Link
            to="/invite-members"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Invite Members
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-8 sm:p-8 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                to={"/projects-list"}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                Projects /
              </Link>
              <span className="cursor-pointer text-gray-500 hover:text-gray-700">
                Project Members
              </span>
            </div>

            <Link
              to="/invite-members"
              className="w-full sm:w-auto bg-blue-darkBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 text-center"
            >
              Invite Members
            </Link>
          </motion.div>

          <div className="w-full bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-2xl shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-darkBlue mb-2 text-start">
              Project Members
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-start">
              Invite your team members to collaborate on this project.
            </p>

            {members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 mb-4 shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <span className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 font-semibold">
                      {member.metadata.name
                        ? member.metadata.name
                            .split(" ")
                            .map((word: string) => word[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "NA"}
                    </span>
                    <span className="flex flex-col">
                      <p className="text-base font-semibold text-darkness-dark ">
                        {member.metadata.name}
                      </p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <select
                      value={member.role}
                      className="p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-darkness-dark appearance-none"
                    >
                      <option>{member.role}</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-darkness-dark">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
