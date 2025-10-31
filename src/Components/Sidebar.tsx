import {
  Menu,
  Folder,
  ListChecks,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Projects", icon: <Folder size={20} />, path: "/projects" },
    { name: "My Tasks", icon: <ListChecks size={20} />, path: "/my-tasks" },
    { name: "My Account", icon: <User size={20} />, path: "/my-account" },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 text-blue-darkBlue"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={28} />
      </button>

      <aside
        className={`fixed top-6 left-0 h-full bg-brightness-primary text-blue-darkBlue transition-all duration-300 mt-10 shadow-2xl ${isCollapsed ? "w-20" : "w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:block `}
      >
        <nav className="mt-6 flex flex-col gap-3 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div
          className="absolute bottom-20 right-0  transform -translate-x-1/2 bg-blue-400 text-white rounded-full p-2 cursor-pointer hover:bg-blue-500 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
