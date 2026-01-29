import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import logo from "../assets/logo.png";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function Navbar({ setIsMobileOpen }: { setIsMobileOpen?: (v: boolean) => void }) {
  const [user, setUser] = useState({ name: "", job_title: "" });

  const refreshAccessToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    if (!refresh_token) return null;

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token })
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      Cookies.set("access_token", data.access_token, {
        expires: 7,
        secure: true,
        sameSite: "strict"
      });

      return data.access_token;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let access_token = Cookies.get("access_token");

        if (!access_token) {
          access_token = await refreshAccessToken();
          if (!access_token) return;
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${access_token}`
          }
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const userData = await response.json();

        setUser({
          name: userData.user_metadata?.name || "",
          job_title: userData.user_metadata?.job_title || "Member"
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
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
    <nav className="w-full bg-brightness-primary shadow-xl py-3 sm:py-4 px-4 sm:px-6 md:px-12 flex items-center z-50">
      <div className="flex items-center gap-3 sm:gap-4 pl-0 sm:pl-6 flex-shrink-0">
        <button
          className="lg:hidden mr-2 p-2 rounded-md text-blue-darkBlue hover:bg-white/60"
          onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <img src={logo} className="w-8 sm:w-10 h-auto" alt="Task Tracker" />
        <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold text-blue-darkBlue whitespace-nowrap">
          Task Management
        </h1>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="text-right hidden md:block min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-gray-600 truncate max-w-[140px] sm:max-w-[220px]">
            {user.name || "Loading..."}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[140px] sm:max-w-[220px]">
            {user.job_title}
          </p>
        </div>

        <div className="relative flex-shrink-0">
          <div className="bg-blue-900 text-white font-semibold w-9 h-9 rounded-full sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg focus:outline-none">
            {initials || "—"}
          </div>
        </div>
      </div>
    </nav>
  );
}
