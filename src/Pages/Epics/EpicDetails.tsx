import { Epic } from "@/Components/Types/Epic";
import { User, UserCircle, Calendar } from "lucide-react";

interface EpicDetailsProps {
  epic: Epic;
}

export function EpicDetails({ epic }: EpicDetailsProps) {
  const formattedDate = new Date(epic.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  const UserRow = ({ label, user }: { label: string; user: { name: string } }) => (
    <div className="flex items-center gap-4 text-sm">
      {label === "Created By" ? (
        <User size={18} className="text-gray-400" />
      ) : (
        <UserCircle size={18} className="text-gray-400" />
      )}

      <span className="text-gray-500 w-24 sm:w-28">{label}:</span>

      <div className="flex items-center gap-2">
        <div className="rounded-full bg-gray-200 text-gray-600 w-7 h-7 flex items-center justify-center font-semibold text-xs">
          {user.name
            ?.split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        <p className="text-gray-800 font-medium">{user.name}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-brightness-light rounded-2xl shadow-xl max-h-[70vh] flex flex-col">
      <div className="overflow-y-auto p-5 sm:p-6 md:p-8">
        <p className="text-xs text-gray-400 mb-3">
          Project / <span className="cursor-pointer hover:text-gray-500">{epic.epic_id}</span>
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{epic.title}</h2>

        <div className="flex flex-col gap-4 mb-6">
          <UserRow label="Created By" user={epic.created_by} />
          <UserRow label="Assignee" user={epic.assignee ?? { name: "Unassigned!" }} />

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-gray-500 w-28">Created At:</span>
            </div>
            <p className="text-gray-800 font-medium">{formattedDate}</p>
          </div>
        </div>

        <hr className="border-gray-200 my-6" />

        <div className="mb-6">
          <p className="text-sm text-gray-800 font-semibold mb-3">Description</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {epic.description || "No Description Provided."}
          </p>
        </div>

        <hr className="border-gray-200 my-6" />

        <div>
          <p className="text-sm text-gray-800 font-semibold mb-6">Tasks</p>
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <p className="font-semibold text-lg text-gray-900">
              No Tasks have been added to this epic yet
            </p>

            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg text-brightness-secondary cursor-pointer px-5 py-2 transition">
              Create New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
