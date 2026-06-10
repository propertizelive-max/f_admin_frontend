"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGoogleCallback } from "@/features/auth";

function CallbackProcessor() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { error } = useGoogleCallback(token);

  if (error) {
    return (
      <div
        className="rounded-2xl p-8 text-center space-y-4"
        style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
      >
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path d="M12 8v4M12 16v.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-[#1a1c1b]">Authentication failed</h2>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-text-muted)" }}>
            {error}
          </p>
        </div>
        <a
          href="/login"
          className="inline-block px-4 py-2 rounded-lg text-[13px] font-medium text-white"
          style={{ background: "var(--color-accent)" }}
        >
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-8 text-center space-y-4"
      style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
    >
      <div className="w-12 h-12 rounded-full bg-[rgba(139,107,71,0.1)] flex items-center justify-center mx-auto">
        <svg
          className="animate-spin"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="40"
            strokeDashoffset="15"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-[16px] font-semibold text-[#1a1c1b]">Signing you in…</h2>
        <p className="text-[13px] mt-1" style={{ color: "var(--color-text-muted)" }}>
          Processing your Google authentication
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Suspense
          fallback={
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                Loading…
              </p>
            </div>
          }
        >
          <CallbackProcessor />
        </Suspense>
      </div>
    </div>
  );
}
