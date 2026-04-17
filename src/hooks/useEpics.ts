import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Epic } from "@/Types/Epic";
import api from "@/API/axiosInstance";

type EpicsResponse = {
  epics: Epic[];
  totalCount: number;
};

export function useEpics(projectId?: string, currentPage: number = 1, limit: number = 9) {
  const navigate = useNavigate();

  const fetchEpics = async (): Promise<EpicsResponse> => {
    if (!projectId) {
      return { epics: [], totalCount: 0 };
    }

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/login");
      return { epics: [], totalCount: 0 };
    }

    try {
      const response = await api.get<Epic[]>(`/rest/v1/project_epics`, {
        params: {
          project_id: `eq.${projectId}`,
          limit,
          offset: (currentPage - 1) * limit
        }
      });

      const contentRange = response.headers["content-range"] || response.headers["Content-Range"];

      const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

      return {
        epics: response.data,
        totalCount
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      }

      throw error; // Rethrow the error to be handled by useQuery's isError
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["epics", projectId, currentPage], // Cash identity, Page 1 != Page 2
    queryFn: fetchEpics,
    enabled: !!projectId, // Only implement the function if the projectId is available
    placeholderData: (prev) => prev // Keep previous data while loading new data to prevent UI breaking
  });

  return {
    epics: data?.epics || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError
  };
}
