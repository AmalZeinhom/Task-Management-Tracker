import api from "@/API/axiosInstance";
import CustomDatePicker from "@/Components/DatePicker";
import Selector from "@/Utils/Selector";
import { statusOptions } from "@/Constants/taskStatus";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useProjectName from "@/hooks/useProjectName";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Required!")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces"
    }),
  description: z.string().max(500).optional(),
  project_id: z.string(),
  epic_id: z.string().optional().nullable(),
  assignee_id: z.string().optional().nullable(),
  due_date: z.string().nullable().optional(),
  status: z.enum([
    "TO_DO",
    "IN_PROGRESS",
    "BLOCKED",
    "IN_REVIEW",
    "READY_FOR_QA",
    "REOPENED",
    "READY_FOR_PRODUCTION",
    "DONE"
  ])
});

type FormData = z.infer<typeof taskSchema>;

export default function Tasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedEpicId = (location.state as any)?.epicId || null;

  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [epicOptions, setEpicOptions] = useState<any[]>([]);

  const [searchParams] = useSearchParams();
  const statusFormUrl = searchParams.get("status") as FormData["status"] | null;
  const projectName = useProjectName(projectId);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project_id: projectId || "",
      epic_id: null,
      assignee_id: null,
      due_date: null,
      status: statusFormUrl || "TO_DO"
    }
  });

  useEffect(() => {
    if (preSelectedEpicId) {
      setValue("epic_id", preSelectedEpicId);
    }
  }, [preSelectedEpicId, setValue]);

  const titleTruncate = (title: string, maxLength = 100) =>
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const res = await api.get("/rest/v1/get_project_members", {
          params: {
            project_id: `eq.${projectId}`
          }
        });

        const mapped = res.data.map((m: any) => ({
          label: m.metadata.name,
          value: m.metadata.sub
        }));

        setAssigneeOptions(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAssignees();
  }, [projectId]);

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const res = await api.get(`/rest/v1/epics?project_id=eq.${projectId}`);

        const mapped = res.data.map((epic: any) => ({
          label: `${epic.epic_id} ${titleTruncate(epic.title)}`,
          value: epic.id
        }));

        setEpicOptions(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEpics();
  }, [projectId]);

  useEffect(() => {
    if (statusFormUrl) {
      setValue("status", statusFormUrl);
    }
  }, [statusFormUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await api.post(`/rest/v1/tasks`, {
        ...data,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null
      });
      if (response.status !== 201 && response.status !== 200) {
        toast.error("Failed to Create the Task");
        return;
      }
      toast.success("Task Created Successfully.");
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId]
      });
      navigate(`/projects/${projectId}/tasks`);
    } catch (err: any) {
      console.log("FULL ERROR:", err.response?.data);
      console.log("STATUS:", err.response?.status);
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
        <div className="flex gap-2 mb-6 text-sm text-gray-500">
          <Link to="/projects" className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>
          <Link
            to={`/projects/${projectId}`}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {projectName} /
          </Link>
          <Link
            to={`/projects/${projectId}/tasks`}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            Tasks /
          </Link>
          <span>Create New</span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-2xl shadow-2xl"
        >
          <div>
            <label>Title</label>
            <input {...register("title")} className="w-full border rounded-xl px-3 py-2 mt-2" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label>Description</label>
            <textarea
              {...register("description")}
              className="w-full border rounded-xl px-3 py-2 mt-2"
            />
          </div>

          <div className="flex flex-row gap-8 md:flex-col">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-4 max-w-[50%]">
                <p>Assigned to</p>
                <Controller
                  control={control}
                  name="assignee_id"
                  render={({ field }) => (
                    <Selector
                      options={assigneeOptions}
                      value={assigneeOptions.find((o) => o.value === field.value) || null}
                      onChange={(val) => field.onChange(val?.value)}
                      placeholder="Select Assignee"
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 max-w-[50%]">
                <p>Status</p>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Selector
                      options={statusOptions()}
                      value={statusOptions().find((o) => o.value === field.value) || null}
                      onChange={(val) => field.onChange(val?.value)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-4 max-w-[50%]">
                <p>Due Date</p>
                <Controller
                  control={control}
                  name="due_date"
                  render={({ field }) => (
                    <CustomDatePicker
                      selectedDate={field.value ? new Date(field.value) : null}
                      onDateChange={(date) => field.onChange(date ? date.toISOString() : null)}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 max-w-[50%]">
                <p>Epic</p>
                <Controller
                  control={control}
                  name="epic_id"
                  render={({ field }) => (
                    <Selector
                      options={epicOptions}
                      value={epicOptions.find((o) => o.value === field.value) || null}
                      onChange={(val) => field.onChange(val?.value)}
                      placeholder="Select Epic"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={` bg-blue-darkBlue text-white w-full sm:w-auto font-semibold px-6 py-3 rounded-xl shadow-2xl tracking-wide hover:bg-cyan-800 transition-colors duration-300 
                          ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-cyan-800"}
                          `}
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}/tasks`)}
                className="px-6 py-3 rounded-xl bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
