import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Epic } from "@/Components/Types/Epic";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export function useEpics(projectId?: string) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEpics = useCallback(async () => {
    if (!projectId) return;

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      toast.error("Unauthorized");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get<Epic[]>(
        `${supabaseUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      setEpics(response.data);
      return response.data;
    } catch {
      setError("Failed to Load Epics");
      return [];
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEpics();
  }, [fetchEpics]);

  return { epics, loading, error, refetch: fetchEpics };
}
