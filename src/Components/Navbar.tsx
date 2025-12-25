import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function Navbar() {
  const [user, setUser] = useState({
    name: "",
    job_title: ""
  });

  const [dropDownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const access_token = Cookies.get("access_token");

        if (!access_token) {
          toast.error("Session expired. Please log in again.");
          return;
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${access_token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const user = await response.json();

        setUser({
          name: user.user_metadata?.name || "",
          job_title: user.user_metadata?.job_title || "Member"
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

  const handleLogOut = async () => {
    try {
      const access_token = Cookies.get("access_token");

      if (!access_token) {
        toast.error("No Active Session Found.");
        return;
      }

      const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  return (
    <nav className="w-full bg-brightness-primary shadow-xl py-4 px-6 sm:px-8 md:px-12 flex justify-between items-center flex-wrap gap-3 z-50">
      <div className="flex items-center gap-3 sm:gap-4 pl-6">
        <img src={logo} className="w-9 sm:w-10 h-auto" alt="Task Tracker" />
        <h1 className="text-xl sm:text-2xl font-bold text-blue-darkBlue whitespace-nowrap">
          Task Management
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden md:block ">
          <h2 className="text-sm sm:text-base font-semibold text-gray-600 truncate max-w-[120px] sm:max-w-[200px]">
            {user.name || "Loading..."}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">{user.job_title}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-blue-900 text-white font-semibold w-9 h-9 rounded-full sm:w-10 sm:h-10 flex items-center justify-center text-base sm-text-lg focus:outline-non"
          >
            {initials || "—"}
          </button>
          {dropDownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
              <button
                onClick={handleLogOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors rounded-t-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
