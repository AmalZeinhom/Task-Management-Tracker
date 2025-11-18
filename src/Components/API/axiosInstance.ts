import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_KEY;

const api = axios.create({
  baseURL: supabaseUrl,
});

const isSecure =
  typeof window !== "undefined" &&
  (window.location.protocol === "https:" || import.meta.env.PROD);

//Interceptors for add the token with every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  console.debug("[api] request interceptor - access_token present:", !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    console.debug("[api] response error status:", status);
    if (status === 401) {
      const refreshToken = Cookies.get("refresh_token");
      console.debug("[api] refresh_token present:", !!refreshToken);
      if (refreshToken) {
        // avoid retry loops
        const originalRequest = error.config as any;
        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Send a new request to renew the token
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
            const newRefreshToken = res.data.refresh_token;

            console.debug(
              "[api] token refresh response, has access_token:",
              !!newAccessToken
            );

            // Store the new tokens into cookies (secure only on HTTPS or in production)
            if (newAccessToken) {
              Cookies.set("access_token", newAccessToken, {
                secure: isSecure,
                sameSite: "strict",
              });
            }
            if (newRefreshToken) {
              Cookies.set("refresh_token", newRefreshToken, {
                secure: isSecure,
                sameSite: "strict",
              });
            }

            // Replicate the original request with the new token
            if (newAccessToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return api(originalRequest);
          } catch (err) {
            console.error("[api] token refresh failed:", err);
            toast.error((err as Error).message || "Session expired");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
