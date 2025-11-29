import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_KEY;

const api = axios.create({
  baseURL: supabaseUrl,
});

//Interceptors for add the token with every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        try {
          //Send a new request to renew the token
          const res = await axios.post(
            `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
            { refresh_token: refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
                apikey: supabasekey,
              },
            }
          );
          const newAccessToken = res.data.access_token;

          //Store the new token into cookies
          Cookies.set("access_token", newAccessToken, { secure: true });

          //Replication the main request
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(error.config);
        } catch (err) {
          toast.error((err as Error).message);
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
