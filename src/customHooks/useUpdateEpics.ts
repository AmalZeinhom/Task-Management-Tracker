import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export function useUpdateEpic() {
  const [loading, setLoading] = useState(false);

  const updateEpic = async (id: string, payload: any) => {
    try {
      setLoading(true);

      await axios.patch(`${supabaseUrl}/rest/v1/epics?id=eq.${id}`, payload, {
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`
        }
      });

      toast.success("Epic Updated Successfully");
      return true;
    } catch {
      toast.error("Failed to Update Epic");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateEpic, loading };
}
