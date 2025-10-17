import React, { useEffect, useRef, useState } from "react";
import forgrtPassword from "../assets/forget-pass.png";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../Components/Common/FormInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// ✅ Supabase keys (from environment)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// ✅ Validation schema
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function ForgetPassword() {
  const { handleSubmit, control, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const emailFrom = watch("email");
  const navigate = useNavigate();

  // ✅ States
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countDown, setCountDown] = useState(300); // 5 minutes
  const [trials, setTrials] = useState(() => {
    const savedTrials = localStorage.getItem("resentTrials");
    return savedTrials ? Number(savedTrials) : 0;
  });

  const timerRef = useRef<number | null>(null);

  // ✅ Countdown logic
  useEffect(() => {
    if (resendDisabled && countDown > 0) {
      timerRef.current = window.setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    } else if (countDown === 0) {
      setResendDisabled(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resendDisabled, countDown]);

  // ✅ API request to send reset link
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email address!");
      }

      toast.success("If an account exists with this email, we’ve sent a password reset link.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error during password reset:", error.message);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle resend logic
  const handleResend = async () => {
    if (!emailFrom) {
      toast.error("Please enter your email first!");
      return;
    }

    if (trials >= 3) {
      toast.error("You’ve reached the resend limit!");
      return;
    }

    setResendDisabled(true);
    setCountDown(300);
    setLoading(true);

    try {
      await onSubmit({ email: emailFrom });
      setTrials((prev) => {
        const next = prev + 1;
        localStorage.setItem("resentTrials", String(next));
        return next;
      });
      toast.success("If an account exists with this email, we’ve sent a password reset link.");
    } catch (error) {
      console.error("Error during resend:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-brightness-primary rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-center max-w-3xl p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
        {/* 🖼️ Left side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={forgrtPassword}
            alt="Forget Password"
            className="max-w-[80%] md:max-w-[90%] h-auto"
          />
        </div>

        {/* 🧾 Right side - Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl text-gray-600 mb-6 text-center md:text-left">
            Forgot Your Password?
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Email"
                  id="email"
                  type="email"
                  field={field}
                  error={fieldState.error}
                />
              )}
            />

            {/* Action Buttons */}
            <div className="buttons flex justify-center gap-3 items-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 bg-darkness-dark text-white py-1 rounded-lg transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-cyan-950"
                }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                onClick={() => navigate("/login")}
                type="button"
                className="w-1/2 bg-cyan-600 text-gray-50 py-1 rounded-lg hover:bg-gray-500 transition-colors ease-linear"
              >
                Back to Sign In
              </button>
            </div>

            {/* Resend Button */}
            <button
              type="button"
              disabled={resendDisabled || loading}
              onClick={handleResend}
              className={`block mx-auto text-sm ${
                resendDisabled ? "text-gray-400" : "text-darkness-iconList hover:underline"
              }`}
            >
              {loading
                ? "Sending..."
                : resendDisabled
                  ? `Resend available in ${Math.floor(countDown / 60)}:${(countDown % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Resend Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
