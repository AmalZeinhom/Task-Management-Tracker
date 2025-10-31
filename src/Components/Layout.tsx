import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  const hideLayoutPaths = [
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {shouldHideLayout ? (
        <main className="min-h-screen">
          <Outlet />
        </main>
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <div className="flex flex-1">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
