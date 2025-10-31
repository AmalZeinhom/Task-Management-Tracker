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
    <nav className="w-full bg-brightness-primary shadow-xl py-4 px-6 sm:px-8 md:px-12 flex justify-between items-center flex-wrap gap-3 z-50">
      <div className="flex items-center gap-3 sm:gap-4 pl-6">
        <img src={logo} className="w-9 sm:w-10 h-auto" alt="Task Tracker" />
        <h1 className="text-xl sm:text-2xl font-bold text-blue-darkBlue whitespace-nowrap">
          Task Management
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden xs:block">
          <h2 className="text-sm sm:text-base font-semibold text-gray-600 truncate max-w-[120px] sm:max-w-[200px]">
            {user.name || "Loading..."}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">{user.job_title}</p>
        </div>

        <div className="bg-blue-darkBlue text-white font-semibold rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg">
          {initials || "—"}
        </div>
      </div>
    </nav>
  );
}
