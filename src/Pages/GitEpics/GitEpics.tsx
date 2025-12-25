import { Link, useParams } from "react-router-dom";

export default function GitEpics() {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-darkBlue">Epics</h1>

        <Link
          to={`/projects/${projectId}/epics/new`}
          className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition"
        >
          + Create New Epic
        </Link>
      </div>

      {/* Epics List */}
      <div className="mb-6">All Epics</div>
    </div>
  );
}
