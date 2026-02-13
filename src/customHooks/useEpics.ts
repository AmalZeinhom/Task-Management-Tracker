import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type Epic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline: string;
  created_at: string;
  created_by: {
    sub: string;
    name: string;
    email: string;
    department: string;
  };
  assignee: {
    sub: string;
    name: string;
    email: string;
    department: string;
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export function useEpics(projectId?: string) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //! Set the fetchEpics function inside the useEffect To prevent recreate it each render
  useEffect(() => {
    if (!projectId) return;

    //! Allow to cancel the request if: 1.Component Unmounted, 2.dependency change, 3.page quick changes
    const controller = new AbortController();

    const fetchEpics = async () => {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        toast.error("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Epic[]>(
          `${supabaseUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },

            //! Give the signal to the axios
            signal: controller.signal
          }
        );

        setEpics(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Failed to Load Epics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEpics();

    //! Cleanup
    return () => controller.abort();
  }, [projectId]);

  return { epics, loading, error };
}
