import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  console.log("CURRENT PATH:", location.pathname);

  const hideLayoutPaths = ["/login", "/signup", "/forget-password", "/reset-password"];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {shouldHideLayout ? (
        <Outlet />
      ) : (
        <div className="h-screen grid grid-rows-[auto,1fr] overflow-hidden bg-gray-50">
          <Navbar setIsMobileOpen={setIsMobileOpen} />

          <div className="grid lg:grid-cols-[auto_1fr] grid-cols-1 overflow-hidden min-h-0">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

            <main className="p-4 sm:p-6 md:p-8 overflow-y-auto min-h-0">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
