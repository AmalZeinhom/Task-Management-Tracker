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
  MessageCircleMore,
  LogOut
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showLogoutToast } from "./Common/LogoutPopUp";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const access_token = Cookies.get("access_token");

      if (access_token) {
        await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${access_token}`
          }
        });
      }

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  const menuItems = [
    {
      name: "Projects",
      icon: <Folder size={20} />,
      hasSubmenu: true,
      submenu: [
        {
          name: "Add New Project",
          icon: <Plus size={20} />,
          path: "/add-new-project"
        },
        {
          name: "Projects List",
          icon: <ListChecks size={20} />,
          path: "/projects-list"
        },
        ...(projectId
          ? [
              {
                name: "Members",
                icon: <User2Icon size={20} />,
                path: `/projects/${projectId}/members`
              }
            ]
          : [])
      ]
    },
    ...(projectId
      ? [
          {
            name: "Epics",
            icon: <MessageCircleMore size={20} />,
            path: `/projects/${projectId}/epics`
          }
        ]
      : []),
    { name: "My Tasks", icon: <CalendarCheck2 size={20} />, path: "/my-tasks" },
    { name: "My Account", icon: <User size={20} />, path: "/my-account" }
  ];

  React.useEffect(() => {
    if (projectId) {
      setIsProjectsOpen(true);
    }
  }, [projectId]);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-blue-darkBlue"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={28} />
      </button>

      <aside
        className={`bg-brightness-primary text-blue-darkBlue flex flex-col shadow-xl transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 z-40`}
      >
        <nav className=" mt-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.path && !item.hasSubmenu ? (
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileOpen(false);
                      }}
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

        <div className="flex-grow" />

        <div
          className="absolute bottom-6 right-0 transform translate-x-1/2 bg-blue-darkBlue text-white rounded-full p-2 cursor-pointer hover:bg-blue-500 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </div>

        <div className="px-3 pb-16 flex flex-col gap-3">
          <button
            onClick={() =>
              showLogoutToast({
                onConfirm: handleLogOut
              })
            }
            className="flex items-center gap-3 p-3 rounded-md text-red-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
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
