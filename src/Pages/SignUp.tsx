import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImg from "../assets/register.png";
import toast from "react-hot-toast";
import FormInput from "../Components/Common/FormInput";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_KEY;

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
    email: z.email("Invalid email address"),
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
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabasekey,
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mesaage || "Something went wrong!");
      }
      const result = await response.json();
      console.error("Signup successful:", result);
      toast.success("Account created successfully");
    } catch (error: any) {
      console.error("Error during regiteration:", error.message);
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-secondary">
      <div className="hidden md:flex justify-center items-center">
        <img src={registerImg} alt="Register" className="max-w-[80%] h-auto" />
      </div>

      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md bg-light p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">Register</h1>
          <p className="text-xs text-dark mb-6 text-center">
            Create a free account or{" "}
            <a href="#" className="text-cyan-600">
              Log IN
            </a>
            .
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <FormInput
                    label="Full Name"
                    id="name"
                    type="text"
                    field={field}
                    error={fieldState.error}
                  />
                </div>
              )}
            />

            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    field={field}
                    error={fieldState.error}
                  />
                </div>
              )}
            />

            <Controller
              name="job_title"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <FormInput
                    label="Job Title (Optional)"
                    id="job_title"
                    type="text"
                    field={field}
                    error={fieldState.error}
                  />
                </div>
              )}
            />

            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <FormInput
                    label="Password"
                    id="password"
                    type="password"
                    field={field}
                    error={fieldState.error}
                  />
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <FormInput
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    field={field}
                    error={fieldState.error}
                  />
                </div>
              )}
            />

            <div className="flex items-center space-x-2">
              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                        Terms & Conditions
                      </label>
                    </div>

                    {fieldState.error && (
                      <p className="text-red-400 text-xs mt-1 text-left">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-darkBlue text-white font-semibold py-2 rounded-lg hover:bg-dark transition-colors"
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
