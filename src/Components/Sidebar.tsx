import {
  Menu,
  Folder,
  ListChecks,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarCheck2,
  User2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const { projectId } = useParams();

  const menuItems = [
    {
      name: "Projects",
      icon: <Folder size={20} />,
      hasSubmenu: true,
      submenu: [
        {
          name: "Add New Project",
          icon: <Plus size={20} />,
          path: "/add-new-project",
        },
        {
          name: "Projects List",
          icon: <ListChecks size={20} />,
          path: "/projects-list",
        },
        {
          name: "Project Members",
          icon: <User2Icon size={20} />,
          path: `/projects/${projectId}/project_members`,
        },
      ],
    },
    { name: "My Tasks", icon: <CalendarCheck2 size={20} />, path: "/my-tasks" },
    { name: "My Account", icon: <User size={20} />, path: "/my-account" },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-blue-darkBlue"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={28} />
      </button>

      <aside
        className={`top-16 left-0 h-[calc(100vh-4rem)] bg-brightness-primary text-blue-darkBlue shadow-xl transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 z-40`}
      >
        <nav className="mt-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <div key={item.name} className="flex flex-col">
              {item.path && !item.hasSubmenu ? (
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ) : (
                <div
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setIsProjectsOpen(!isProjectsOpen);
                    }
                  }}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              )}

              {item.hasSubmenu && isProjectsOpen && !isCollapsed && (
                <div className="ml-6 flex flex-col gap-1 mt-1">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      {sub.icon}
                      <span>{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div
          className="absolute bottom-6 right-0 transform translate-x-1/2 bg-blue-darkBlue text-white rounded-full p-2 cursor-pointer hover:bg-blue-500 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
