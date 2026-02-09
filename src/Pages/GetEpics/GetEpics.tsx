// import { Link, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { HiOutlineLightBulb } from "react-icons/hi";
// import { IoMdMore } from "react-icons/io";
// import { useEffect, useMemo, useState } from "react";

// export default function GetEpics() {
//   const { projectId } = useParams();
//   const [epics, setEpics] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const today = useMemo(() => new Date().toISOString().split("T")[0], []);

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
//           {[1, 2, 3].map((x) => (
//             <div key={x} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!loading && epics.length === 0) {
//     return (
//       <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg mb-3">You don’t have any Epics yet.</p>
//           <Link
//             to={`/projects/${projectId}/epics/new`}
//             className="px-4 py-2 bg-blue-darkBlue text-white rounded-lg hover:bg-cyan-800 transition"
//           >
//             Create New Epic
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-7xl mx-auto bg-brightness-light rounded-2xl p-6 sm:p-8"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
//         >
//           <div className="flex flex-wrap gap-2 text-sm">
//             <Link to="/projects" className="text-gray-500 hover:text-gray-700">
//               Projects /
//             </Link>
//             <Link to={`/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
//               {projectId} /
//             </Link>
//             <span className="text-gray-700 font-medium">Epics</span>
//           </div>

//           <Link
//             to={`/projects/${projectId}/epics/new`}
//             className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition w-full sm:w-auto text-center"
//           >
//             + Create New Epic
//           </Link>
//         </motion.div>

//         <div className="bg-brightness-primary rounded-xl shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div className="flex flex-wrap items-center gap-6">
//             <HiOutlineLightBulb size={24} />
//             <div className="flex flex-col gap-2">
//               <p className="font-bold text-sm">
//                 Make an Automatic Payment System that enable the design
//               </p>
//               <div className="flex items-center gap-3 text-xs">
//                 <p>#Epic-1</p>
//                 <p>
//                   Opened by <span className="font-bold">Amal Nasr</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-6">
//             <div>
//               <p className="text-xs font-bold text-darkness-iconList">Created At</p>
//               <input type="date" min={today} className="w-full" />
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="rounded-full bg-gray-300 text-gray-600 py-3 px-2 font-bold text-sm">
//                 AM
//               </span>
//               <p className="font-bold text-gray-500">Amal Nasr</p>
//             </div>

//             <IoMdMore size={24} />
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi";
import { IoMdMore } from "react-icons/io";
import { useEffect, useMemo, useState } from "react";

interface Epic {
  id: string;
  title: string;
  author: string;
  code: string;
}

export default function GetEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setEpics([
        { id: "1", title: "Automatic Payment System", author: "Amal Nasr", code: "#Epic-1" },
        { id: "2", title: "Task Management Feature", author: "Amal Nasr", code: "#Epic-2" }
      ]);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto bg-brightness-light rounded-2xl p-6 sm:p-8 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/projects" className="text-gray-500 hover:text-gray-700">
              Projects /
            </Link>
            <Link to={`/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
              {projectId} /
            </Link>
            <span className="text-gray-700 font-medium">Epics</span>
          </div>

          <Link
            to={`/projects/${projectId}/epics/new`}
            className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition w-full sm:w-auto text-center"
          >
            + Create New Epic
          </Link>
        </motion.div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((x) => (
              <div key={x} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {!loading && epics.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-600 text-lg mb-3">You don’t have any Epics yet.</p>
            <Link
              to={`/projects/${projectId}/epics/new`}
              className="px-4 py-2 bg-blue-darkBlue text-white rounded-lg hover:bg-cyan-800 transition"
            >
              Create New Epic
            </Link>
          </div>
        )}

        {!loading && epics.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="bg-brightness-primary rounded-xl shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <HiOutlineLightBulb size={24} />
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-sm">
                    Make an Automatic Payment System that enable the design
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <p>#Epic-1</p>
                    <p>
                      Opened by <span className="font-bold">Amal Nasr</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs font-bold text-darkness-iconList">Created At</p>
                  <input type="date" min={today} className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-300 text-gray-600 py-3 px-2 font-bold text-sm">
                    AM
                  </span>
                  <p className="font-bold text-gray-500">Amal Nasr</p>
                </div>
                <IoMdMore size={24} />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
