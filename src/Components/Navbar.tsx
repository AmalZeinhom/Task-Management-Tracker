import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Navbar() {
  const [user, setUser] = useState({
    name: "",
    job_title: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const access_token = Cookies.get("access_token");

        if (!access_token) {
          toast.error("Session expired. Please log in again.");
          return;
        }

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(access_token);

        if (error) throw error;
        if (!user) {
          toast.error("User not found");
          return;
        }

        setUser({
          name: user.user_metadata?.name,
          job_title: user.user_metadata?.job_title || "Member",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "";

  return (
    <nav className="w-full bg-brightness-primary shadow-xl py-4 px-9 flex justify-between items-center flex-wrap z-50">
      <div className="flex items-center gap-4">
        <img src={logo} className="w-10 h-auto" alt="Task Tracker" />
        <h1 className="text-2xl font-bold text-blue-darkBlue">
          Task Management
        </h1>
      </div>

      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <div className="text-right">
          <h2 className="text-sm lg:text-base font-semibold text-gray-600">
            {user.name || "Loading..."}
          </h2>
          <p className="text-xs lg:text-sm text-gray-500">{user.job_title}</p>
        </div>
        <div className="bg-blue-darkBlue text-white font-semibold rounded-full w-10 h-10 flex items-center justify-center text-lg">
          {initials || "—"}
        </div>
      </div>
    </nav>
  );
}
