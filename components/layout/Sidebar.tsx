"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

// ── Icons ────────────────────────────────────────────────────────────────────

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="9" width="3.5" height="8" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="7.25" y="5" width="3.5" height="12" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="13.5" y="1" width="3.5" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

function CategoriesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6.5C2 5.4 2.9 4.5 4 4.5H14C15.1 4.5 16 5.4 16 6.5V12C16 13.1 15.1 14 14 14H4C2.9 14 2 13.1 2 12V6.5Z" fill="currentColor" opacity="0.4" />
      <rect x="5" y="4" width="8" height="2" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="4" y="9" width="10" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="6.5" y="14" width="1.5" height="3" rx="0.75" fill="currentColor" opacity="0.6" />
      <rect x="10" y="14" width="1.5" height="3" rx="0.75" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 2H3.5L5 10H13.5L15.5 5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="13.5" r="1.5" fill="currentColor" />
      <circle cx="12.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ContactsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3h14a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" fill="currentColor" opacity="0.3" />
      <path d="M1 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 1.5V3M9 15V16.5M1.5 9H3M15 9H16.5M3.2 3.2L4.3 4.3M13.7 13.7L14.8 14.8M14.8 3.2L13.7 4.3M4.3 13.7L3.2 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7C7 5.9 7.9 5 9 5C10.1 5 11 5.9 11 7C11 8.1 9 8.5 9 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2H3C2.4 2 2 2.4 2 3V13C2 13.6 2.4 14 3 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 5L14 8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Nav data ─────────────────────────────────────────────────────────────────

const mainNav = [
  { label: "Analytics", href: ROUTES.ANALYTICS.OVERVIEW, icon: AnalyticsIcon, match: "/analytics" },
  { label: "Categories", href: ROUTES.CATEGORIES.LIST, icon: CategoriesIcon, match: "/categories" },
  { label: "Products", href: ROUTES.PRODUCTS.LIST, icon: ProductsIcon, match: "/products" },
  { label: "Orders",   href: ROUTES.ORDERS.LIST,   icon: OrdersIcon,   match: "/orders" },
  { label: "Contacts", href: ROUTES.CONTACTS.LIST, icon: ContactsIcon, match: "/contacts" },
];

const footerNav = [
  { label: "Settings", href: "#", icon: SettingsIcon },
  { label: "Support", href: "#", icon: SupportIcon },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-[256px] shrink-0 h-full overflow-y-auto"
      style={{ background: "var(--color-sidebar-bg)", borderRight: "1px solid var(--color-border)" }}
    >
      {/* Brand */}
      <div className="px-6 py-6">
        <Link href={ROUTES.DASHBOARD} className="block">
          <span
            className="block text-[18px] leading-tight tracking-tight text-[#1a1c1b]"
            style={{ fontFamily: "var(--font-molengo), serif" }}
          >
            Nordic Hearth
          </span>
          <span
            className="block text-[11px] mt-0.5 tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Admin Dashboard
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--color-border)", margin: "0 24px" }} />

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {mainNav.map(({ label, href, icon: Icon, match }) => {
            const active = pathname.startsWith(match);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                    active
                      ? "text-[#1a1c1b]"
                      : "text-[#444748] hover:text-[#1a1c1b] hover:bg-[var(--color-accent-light)]"
                  )}
                  style={active ? { background: "var(--color-nav-active-bg)" } : undefined}
                >
                  <Icon
                    className={cn(
                      "shrink-0",
                      active ? "text-[#1a1c1b]" : "text-[#9a9b9b]"
                    )}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer nav */}
      <div className="px-3 pb-2">
        <ul className="space-y-0.5">
          {footerNav.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-[#444748] hover:text-[#1a1c1b] hover:bg-[var(--color-accent-light)] transition-colors"
              >
                <Icon className="shrink-0 text-[#9a9b9b]" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--color-border)", margin: "0 24px" }} />

      {/* User profile */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            ES
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#1a1c1b] truncate">Admin</p>
            <p className="text-[11px] tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              ADMINISTRATOR
            </p>
          </div>
          <button
            className="shrink-0 p-1 rounded hover:bg-[var(--color-accent-light)] transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            title="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}
