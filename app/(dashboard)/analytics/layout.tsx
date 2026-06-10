"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const tabs = [
  { label: "Dashboard", href: ROUTES.ANALYTICS.OVERVIEW },
  { label: "Sales", href: ROUTES.ANALYTICS.SALES },
  { label: "Products", href: ROUTES.ANALYTICS.PRODUCTS },
];

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <div
        className="shrink-0 px-8 pt-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <p
          className="text-[11px] font-medium tracking-widest uppercase mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Analytics
        </p>
        <div className="flex items-center gap-1">
          {tabs.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
                  active
                    ? "border-[var(--color-accent)] text-[#1a1c1b]"
                    : "border-transparent text-[#444748] hover:text-[#1a1c1b] hover:border-[var(--color-border)]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
