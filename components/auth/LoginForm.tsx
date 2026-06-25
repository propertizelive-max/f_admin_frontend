"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios, { type AxiosError } from "axios";
import { useLogin } from "@/features/auth";
import { loginSchema, type LoginFormValues } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import env from "@/config/env";

// ── Shared primitives ──────────────────────────────────────────────────────────

const inputBase =
  "w-full px-3.5 py-2.5 text-[14px] rounded-lg border outline-none transition-colors bg-white text-[#1a1c1b] placeholder:text-[#9a9b9b]";
const inputBorder = "border-[rgba(26,28,27,0.15)] focus:border-[#8b6b47]";
const inputError = "border-red-300 focus:border-red-400";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-red-500">{message}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[13px] font-medium text-[#1a1c1b] mb-1.5">
      {children}
      <span className="ml-0.5 text-red-500">*</span>
    </label>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await mutateAsync(values);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      if (!axios.isAxiosError(err) && err instanceof Error) {
        setServerError(err.message);
      } else {
        const axiosErr = err as AxiosError<{ message: string | string[] }>;
        const raw = axiosErr.response?.data?.message;
        const msg = Array.isArray(raw) ? raw[0] : raw;
        setServerError(msg ?? "Invalid email or password.");
      }
    }
  }

  return (
    <div
      className="rounded-2xl p-8 space-y-6"
      style={{
        background: "var(--color-sidebar-bg)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Heading */}
      <div className="text-center space-y-1">
        <h1
          className="text-[22px] font-semibold text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-molengo, serif)" }}
        >
          Welcome back
        </h1>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          Sign in to your admin account
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.15" />
            <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <p className="text-[13px] text-red-600">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <Label>Email</Label>
          <input
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            className={`${inputBase} ${errors.email ? inputError : inputBorder}`}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`${inputBase} ${errors.password ? inputError : inputBorder}`}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-xl text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "var(--color-accent)" }}
        >
          {isPending ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="28"
                  strokeDashoffset="10"
                />
              </svg>
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => {
          window.location.href = `${env.API_BASE_URL}/auth/google`;
        }}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-[14px] font-medium text-[#1a1c1b] border transition-colors hover:bg-[rgba(26,28,27,0.04)]"
        style={{ borderColor: "var(--color-border)" }}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  );
}
