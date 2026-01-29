import { Link, useParams } from "react-router-dom";

export default function GitEpics() {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-blue-darkBlue">Epics</h1>

        <Link
          to={`/projects/${projectId}/epics/new`}
          className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition w-full sm:w-auto text-center"
        >
          + Create New Epic
        </Link>
      </div>

      <div className="mb-6">All Epics</div>
    </div>
  );
}
