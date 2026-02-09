import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { motion } from "framer-motion";
import FormInput from "../Components/Common/FormInput";
import { EyeClosedIcon, EyeOpenIcon } from "../assets/icons/eye";
import { LockKeyholeOpenIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be less than 64 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character")
      .refine((val) => !/\s/.test(val), {
        message: "Password cannot contain spaces"
      }),
    confirmPassword: z.string().refine((val) => !/\s/.test(val), {
      message: "Please confirm your password"
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"]
  });

type FormData = z.infer<typeof schema>;

export function ResetPassword() {
  const { handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    const param = new URLSearchParams(hash.replace("#", "?"));
    const token = param.get("access_token");

    if (token) {
      setAccessToken(token);
    } else {
      setIsValidLink(false);
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!accessToken) {
      toast.error("Invalid or Expired Link");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: data.newPassword })
      });
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
      toast.success("Your password has been updated successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        Invalid or expired reset link.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900 flex justify-center items-center gap-2">
          <LockKeyholeOpenIcon className="w-6 h-6 text-blue-600" />
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <FormInput
                  label="Enter New Password"
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  field={field}
                  error={fieldState.error}
                  icon={
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                  }
                />
              </div>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <FormInput
                  label="Confirm Your Password"
                  id="confirmPassword"
                  type="password"
                  field={field}
                  error={fieldState.error}
                />
              </div>
            )}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white font-medium transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
