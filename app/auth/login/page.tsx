"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { GraduationCap, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back to VarsityQuest!");
        router.push("/dashboard");
        router.refresh(); // refresh session state
      }
    } catch (error) {
      console.error("Login onSubmit error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google sign in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-neutral py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-outline-variant-custom/40 rounded-2xl p-10 shadow-level2">
        
        {/* Back to Home Link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-container hover:text-secondary transition-all"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary-container text-white rounded-md">
              <GraduationCap size={24} />
            </div>
            <span className="font-bold text-headline-md tracking-tight text-on-surface">
              Varsity<span className="text-primary-container">Quest</span>
            </span>
          </Link>
          <h2 className="text-center font-bold text-headline-md text-on-surface">
            Sign In to your account
          </h2>
          <p className="mt-1 text-center text-xs text-on-surface-variant font-semibold">
            Or{" "}
            <Link href="/auth/register" className="font-bold text-primary-container hover:text-secondary hover:underline transition-all">
              create a new student account
            </Link>
          </p>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            
            {/* Email field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@university.com"
                  {...register("email")}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white border rounded-default shadow-level1 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container ${
                    errors.email ? "border-error" : "border-outline-variant-custom"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-on-surface-variant">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white border rounded-default shadow-level1 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container ${
                    errors.password ? "border-error" : "border-outline-variant-custom"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-error font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isGoogleLoading}
              className="w-full justify-center shadow-sm"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
            <span className="bg-white px-2 text-on-surface-variant">Or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div>
          <button
            type="button"
            disabled={isLoading || isGoogleLoading}
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant-custom rounded-default bg-white text-xs font-bold text-on-surface-variant hover:bg-surface-low shadow-level1 transition-all disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,16.5,14.65,18,12,18a6,6,0,1,1,0-12,5.92,5.92,0,0,1,3.87,1.43l2-2A8.91,8.91,0,0,0,12,3a9,9,0,1,0,9,9A8.82,8.82,0,0,0,21.35,11.1Z" fill="#0f766e" />
                </g>
              </svg>
            )}
            Sign in with Google
          </button>
        </div>

      </div>
    </div>
  );
}
