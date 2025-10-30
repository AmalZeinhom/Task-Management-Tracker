// import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
  ];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <main className="py-5">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
