import React from "react";
import { motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../Components/API/axiosInstance";
import { Link } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Project Title is Required!" })
    .min(3, { message: "Project Title must be at  3 characters" })
    .max(50, { message: "Project Title must be at most 50 characters" })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces",
    }),
  description: z
    .string()
    .max(500, { message: "Message must be at most 500 characters" })
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddNewProject() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await api.post(
        `${supabaseUrl}/rest/v1/projects`,
        {
          name: data.title,
          description: data.description,
        },
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        toast.error("Failed to Create the Project");
        return;
      }
      toast.success("Project Created Successfully.");
      reset();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Failed: ${error.response?.status} ${error.response?.data?.message || ""}`
        );
      } else {
        toast.error("Unknown Error Occurred");
      }
    }
  };
  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-8 sm:p-8 md:p-10"
      >
        <div className="flex flex-wrap gap-2 mx-auto mb-6 text-sm">
          <Link
            to={"/projects-list"}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            Projects /
          </Link>
          <span className="cursor-pointer text-gray-500 hover:text-gray-700">
            Create New Project
          </span>
        </div>

        <form
          className="w-full bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-2xl shadow-2xl"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-darkBlue mb-6 text-center">
            Create New Project
          </h2>

          <label htmlFor="project-title"> Project Title</label>
          <input
            type="text"
            id="project-title"
            {...register("title")}
            className="w-full min-h-11 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mb-4">{errors.title.message}</p>
          )}

          <label htmlFor="project-description"> Project Description</label>
          <textarea
            id="project-description"
            {...register("description")}
            className="w-full min-h-28 sm:min-h-32 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mb-4">
              {errors.description.message}
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-blue-darkBlue text-white w-full sm:w-auto font-semibold px-6 py-3 rounded-xl shadow-2xl tracking-wide hover:bg-cyan-800 transition-colors duration-300"
          >
            Create Project
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
