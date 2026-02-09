import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type FormData = { email: string };

export default function InviteMembers() {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    toast.success(`Invite sent to ${data.email}`);
    reset();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-blue-darkBlue">Invite Members</h1>
              <p className="text-sm text-gray-500">Send email invites to join your project.</p>
            </div>
            <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-700">
              Back to Projects
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-brightness-primary rounded-2xl p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-gray-700">Member Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="member@example.com"
            className="mt-2 mb-4 w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-darkBlue text-white rounded"
            >
              Send Invite
            </button>

            <p className="text-sm text-gray-500">You can send multiple invites one by one.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
