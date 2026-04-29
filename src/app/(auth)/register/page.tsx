"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { registerSchema, type RegisterFormData } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register: doRegister, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await doRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created — welcome!");
      router.push("/user");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold">
                <span className="text-gray-900">Style</span>
                <span className="text-orange-500">Gen</span>
              </h1>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h2>
            <p className="text-gray-500">
              Create your artisan account to manage orders and profile.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                FULL NAME
              </label>
              <input
                id="name"
                {...register("name")}
                className={cn(
                  "block w-full pr-3 py-3 border rounded-lg",
                  "placeholder:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-offset-0",
                  errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                )}
                placeholder="Your full name"
                onChange={() => {
                  if (error) clearError();
                }}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="name@company.com"
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-lg",
                    "placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                  )}
                  onChange={() => {
                    if (error) clearError();
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border rounded-lg",
                    "placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                  )}
                  onChange={() => {
                    if (error) clearError();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={cn(
                  "block w-full pr-3 py-3 border rounded-lg",
                  "placeholder:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-offset-0",
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                )}
                onChange={() => {
                  if (error) clearError();
                }}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center px-6 py-3",
                "text-base font-semibold text-white",
                "bg-orange-500 hover:bg-orange-600",
                "rounded-lg shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "group",
              )}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-orange-500 to-orange-700">
        <div className="flex items-center justify-center p-12 w-full">
          <div className="max-w-lg text-center">
            <h2 className="text-4xl font-bold text-white mb-4 font-display">
              Premium Leather Goods
            </h2>
            <p className="text-orange-100 text-lg leading-relaxed">
              Access your artisan portal to manage orders, track shipments, and
              discover our latest handcrafted collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
