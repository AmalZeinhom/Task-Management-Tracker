import api from "@/API/axiosInstance";
import EditableText from "@/Components/EditableText";
import CustomDatePicker from "@/Components/DatePicker";
import { Epic } from "@/Types/Epic";
import { User, UserCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface Member {
  member_id: string;
  user_id: string;
  metadata: {
    name: string;
    email: string;
  };
}

interface EpicDetailsProps {
  epic: Epic;
  onUpdate: (data: Partial<Epic>) => void;
}

export function EpicDetails({ epic, onUpdate }: EpicDetailsProps) {
  const [members, setMembers] = useState<Member[]>([]);

  const formattedDate = new Date(epic.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/rest/v1/get_project_members?project_id=eq.${epic.project_id}`);
        setMembers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMembers();
  }, [epic.project_id]);

  const updateEpic = async (id: string, data: any) => {
    await api.patch(`/rest/v1/epics?id=eq.${id}`, data, {
      headers: {
        Prefer: "return=representation"
      }
    });
  };

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

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          <EditableText
            value={epic.title}
            onSave={(newTitle: string) => {
              updateEpic(epic.id, { title: newTitle });
              onUpdate({ title: newTitle });
            }}
            className="text-2xl font-semibold"
          />
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <UserRow label="Created By" user={epic.created_by} />

          <div className="flex items-center gap-4 text-sm">
            <UserCircle size={18} className="text-gray-400" />

            <span className="text-gray-500 w-24 sm:w-28">Assignee:</span>

            <select
              value={epic.assignee?.sub || ""}
              onChange={(e) => {
                const newUserId = e.target.value;

                updateEpic(epic.id, { assignee_id: newUserId });

                onUpdate({
                  assignee: {
                    sub: newUserId,
                    name:
                      members.find((m) => m.user_id === newUserId)?.metadata.name || "Unassigned",
                    email: "",
                    department: ""
                  }
                });
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.member_id} value={member.user_id}>
                  {member.metadata.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-gray-500 w-28">Created At:</span>
            </div>
            <p className="text-gray-800 font-medium">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-gray-500 w-24 sm:w-28">Deadline:</span>

            <CustomDatePicker
              selectedDate={epic.deadline ? new Date(epic.deadline) : null}
              onDateChange={(date) => {
                updateEpic(epic.id, { deadline: date ? date.toISOString() : null });

                onUpdate({
                  deadline: date ? date.toISOString() : undefined
                });
              }}
            />
          </div>
        </div>

        <hr className="border-gray-200 my-6" />

        <div className="mb-6">
          <p className="text-sm text-gray-800 font-semibold mb-3">Description</p>

          <EditableText
            value={epic.description || ""}
            placeholder="Add description..."
            onSave={(newDesc: string) => {
              updateEpic(epic.id, { description: newDesc });
              onUpdate({ description: newDesc });
            }}
            className="text-gray-600 text-sm leading-relaxed"
          />
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
