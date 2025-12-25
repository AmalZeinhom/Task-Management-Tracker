import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  const hideLayoutPaths = ["/login", "/signup", "/forget-password", "/reset-password"];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {shouldHideLayout ? (
        <Outlet />
      ) : (
        <div className="h-screen grid grid-rows-[auto,1fr] overflow-hidden bg-gray-50">
          <Navbar />

          <div className="grid grid-cols-[auto_1fr] overflow-hidden">
            <Sidebar />

            <main className="p-6 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
