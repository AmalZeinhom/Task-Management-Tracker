import api from "@/API/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/v1/user");

      const user = response.data;

      return {
        name: user?.user_metadata?.name || "",
        job_title: user?.user_metadata?.job_title || "Member"
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);
