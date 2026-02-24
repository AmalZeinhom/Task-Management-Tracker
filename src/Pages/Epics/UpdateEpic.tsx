import { useUpdateEpic } from "@/customHooks/useUpdateEpics";
import { Epic } from "@/Components/Types/Epic";
import { useState } from "react";
import toast from "react-hot-toast";

type UpdateEpicProps = {
  epic: Epic;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function UpdateEpic({ epic, onClose, onSuccess }: UpdateEpicProps) {
  const { updateEpic, loading } = useUpdateEpic();

  const formattedDate = new Date(epic.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  const [originalData] = useState({
    title: epic.title,
    description: epic.description ?? "",
    assignee_id: epic.assignee?.sub ?? null,
    deadline: epic.deadline ?? null,
    createdAt: epic.created_at
  });

  const [formData, setFormData] = useState(originalData);

  const handleSave = async () => {
    const payload: any = {};

    if (!formData.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    if (formData.title !== originalData.title) {
      payload.title = formData.title;
    }

    if (formData.description !== originalData.description) {
      payload.description = formData.description;
    }

    if (formData.assignee_id !== originalData.assignee_id) {
      payload.assignee_id = formData.assignee_id;
    }

    if (formData.deadline !== originalData.deadline) {
      payload.deadline = formData.deadline;
    }

    if (Object.keys(payload).length === 0) {
      toast.error("No changes to save");
      return;
    }

    const success = await updateEpic(epic.id, payload);

    if (success) {
      await onSuccess();
      onClose();
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-brightness-light rounded-2xl shadow-xl max-h-[70vh] flex flex-col">
      <div className="overflow-y-auto p-5 sm:p-6 md:p-8">
        <p className="text-xs text-gray-400 mb-3">
          Project / <span className="cursor-pointer hover:text-gray-500">{epic.epic_id}</span>
        </p>

        <div className="flex flex-col gap-8 mb-6">
          <span className="flex flex-col gap-1">
            <p className="text-sm text-gray-800 font-semibold">Title</p>
            <input
              type="text"
              value={formData.title}
              disabled={loading}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="border rounded-lg p-2"
            />
          </span>

          <span className="flex flex-col gap-1">
            <p className="text-sm text-gray-800 font-semibold">Assignee</p>
            <select
              value={formData.assignee_id ?? ""}
              disabled={loading}
              onChange={(e) => setFormData((prev) => ({ ...prev, assignee_id: e.target.value }))}
              className="border rounded-lg p-2"
            >
              <option>Assigned</option>
            </select>
          </span>

          <span className="flex flex-col gap-1">
            <p className="text-sm text-gray-800 font-semibold">Creted At</p>
            <p className="border rounded-lg p-2 bg-brightness-primary text-gray-600">
              {formattedDate}
            </p>
          </span>

          <span className="flex flex-col gap-1">
            <p className="text-sm text-gray-800 font-semibold">Deadline</p>
            <input
              type="date"
              min={today}
              value={formData.deadline ?? ""}
              disabled={loading}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              className="border rounded-lg p-2"
            />
          </span>

          <hr className="border-gray-200 my-6" />

          <p className="text-sm text-gray-800 font-semibold">Description</p>
          <textarea
            value={formData.description}
            disabled={loading}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="border rounded-lg p-2"
            placeholder="Description"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
