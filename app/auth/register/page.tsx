"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { GraduationCap, Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
          name: data.name || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to register");
      }

      toast.success("Account created successfully! Signing in...");

      // Automatically sign in the user
      const loginRes = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.error("Registration succeeded but auto-login failed. Please sign in manually.");
        router.push("/auth/login");
      } else {
        toast.success("Welcome to VarsityQuest!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Registration onSubmit error:", error);
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
            Create your Student Account
          </h2>
          <p className="mt-1 text-center text-xs text-on-surface-variant font-semibold">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary-container hover:text-secondary hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <form className="mt-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            
            {/* Name field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <input
                  id="name"
                  type="text"
                  placeholder="Rahul Sharma"
                  {...register("name")}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white border rounded-default shadow-level1 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container ${
                    errors.name ? "border-error" : "border-outline-variant-custom"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-error font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-xs font-bold text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
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
              className="w-full justify-center shadow-sm"
            >
              Register Account
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
