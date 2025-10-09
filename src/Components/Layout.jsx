// import React, { useState } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <main className="py-5">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
