import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImg from "../assets/register.png";
import toast from "react-hot-toast";

// ✅ 1. Define Validation Schema using zod
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(/^[A-Za-z\u0600-\u06FF ]+$/, "Name can only contain letters and spaces")
      .refine((val) => !/\s{2,}/.test(val), {
        message: "Name cannot contain multiple consecutive spaces",
      }),
    email: z.string().email("Invalid email address"),
    job_title: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be less than 64 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character")
      .refine((val) => !/\s/.test(val), {
        message: "Password cannot contain spaces",
      }),
    confirmPassword: z.string().refine((val) => !/\s/.test(val), {
      message: "Please confirm your password",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  // ✅ 2. Using useForm with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // ✅ 3. Submit Function
  const onSubmit = async (data: SignUpFormData) => {
    console.log("Form Data:", data);

    const response = await fetch("https://vesyalmewlvmceevyias.supabase.co/auth/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlc3lhbG1ld2x2bWNlZXZ5aWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTg1NzMsImV4cCI6MjA3NDU3NDU3M30.LKV0Hqg2KpD7lMBg-bnvrfChU_ePWHqD_mIEYnqBJCc",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data: {
          name: data.name,
          job_title: data.job_title || "",
        },
      }),
    });

    if (response.ok) {
      toast("Good Job!", {
        icon: "👏",
      });
      window.location.href = "/"; // Redirect to main page
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      toast.error("Failed to register, Please try again!");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-secondary">
      {/* ============== Image ============== */}
      <div className="hidden md:flex justify-center items-center">
        <img src={registerImg} alt="Register" className="max-w-[80%] h-auto" />
      </div>

      {/* ============== Form ============== */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md bg-light p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">Welcome back, Yash</h1>
          <p className="text-xs text-dark mb-6 text-center">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Name"
                {...register("name")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 text-left">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 text-left">{errors.email.message}</p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <input
                type="text"
                placeholder="Job Title (optional)"
                {...register("job_title")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 text-left">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" {...register("terms")} />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Terms & Conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-xs mt-1 text-left">{errors.terms.message}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-darkBlue text-white font-semibold py-2 rounded-lg hover:bg-dark transition-colors"
            >
              Sign Up
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?
              <a href="/home" className="underline underline-offset-2 ms-2">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
