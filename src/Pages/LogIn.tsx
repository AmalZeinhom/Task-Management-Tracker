import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImg from "../assets/register.png";
import toast from "react-hot-toast";
import FormInput from "../Components/Common/FormInput";
import { NavLink, useNavigate } from "react-router-dom";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_KEY;

const signUpSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().nonempty("Password is required"),
  rememberME: z.boolean().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function LogIn() {
  const { handleSubmit, control } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabasekey,
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password!");
      }
      const result = await response.json();
      console.error("Login successful:", result);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error during login:", error.message);
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-secondary">
      <div className="hidden md:flex justify-center items-center">
        <img src={registerImg} alt="Register" className="max-w-[80%] h-auto" />
      </div>

      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md bg-light p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">
            Welcome Back!
          </h1>
          <p className="text-xs text-dark mb-6 text-center">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              name="password"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  field={field}
                  error={fieldState.error}
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5
                c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0
                .639C20.577 16.49 16.64 19.5 12
                19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3
                3 0 0 1 6 0Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477
                10.477 0 0 0 1.934 12C3.226
                16.338 7.244 19.5 12 19.5c.993
                0 1.953-.138 2.863-.395M6.228
                6.228A10.451 10.451 0 0 1 12
                4.5c4.756 0 8.773 3.162 10.065
                7.498a10.522 10.522 0 0 1-4.293
                5.774M6.228 6.228 3 3m3.228
                3.228 3.65 3.65m7.894 7.894L21
                21m-3.228-3.228-3.65-3.65m0
                0a3 3 0 1 0-4.243-4.243m4.242
                4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </button>
                  }
                />
              )}
            />

            <div className="flex justify-between space-x-2">
              <Controller
                name="rememberME"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberME"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor="rememberME"
                        className="text-sm text-gray-500 cursor-pointer"
                      >
                        Remember me?
                      </label>
                    </div>
                  </div>
                )}
              />

              <div>
                <NavLink
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Forgot password?
                </NavLink>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-darkBlue text-white font-semibold py-2 rounded-lg hover:bg-dark transition-colors"
            >
              Log IN
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?
              <NavLink
                to="/signup"
                className="underline underline-offset-2 ms-2"
              >
                Sign up for free
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
