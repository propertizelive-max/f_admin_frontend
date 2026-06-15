"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ContactStatus } from "@/types/backend.types";
import type { ContactResponse } from "@/types/backend.types";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  [ContactStatus.NEW]:     { label: "New",     color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  [ContactStatus.READ]:    { label: "Read",    color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  [ContactStatus.REPLIED]: { label: "Replied", color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
};

function ContactStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[ContactStatus.NEW];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap capitalize"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export function ContactTableSkeleton() {
  const cols = ["Name", "Email", "Phone", "Subject", "Status", "Date", "Actions"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {cols.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              {[120, 160, 90, 100, 72, 72, 40].map((w, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div className="h-3 rounded animate-pulse" style={{ width: w, background: "rgba(26,28,27,0.07)" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ContactEmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-nav-active-bg)" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 6h20v16a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 6l10 9 10-9" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-[15px] font-medium text-[#1a1c1b] mb-1">
        {hasSearch ? "No contacts match your search" : "No contacts yet"}
      </p>
      <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
        {hasSearch ? "Try adjusting your search or filter." : "Customer contact submissions will appear here."}
      </p>
    </div>
  );
}

interface ContactTableProps {
  contacts: ContactResponse[];
  hasSearch?: boolean;
}

export function ContactTable({ contacts, hasSearch }: ContactTableProps) {
  if (contacts.length === 0) return <ContactEmptyState hasSearch={hasSearch} />;

  const cols = ["Name", "Email", "Phone", "Subject", "Status", "Date", "Actions"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {cols.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              style={{ borderBottom: "1px solid var(--color-border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,28,27,0.018)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <td className="px-4 py-3.5 whitespace-nowrap">
                <p className="text-[13px] font-medium text-[#1a1c1b]">{contact.fullName}</p>
              </td>

              <td className="px-4 py-3.5">
                <p className="text-[13px] truncate max-w-[180px]" style={{ color: "var(--color-text-secondary)" }}>{contact.email}</p>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="text-[13px]" style={{ color: "var(--color-text-secondary)" }}>{contact.phoneNumber}</span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md capitalize"
                  style={{ background: "rgba(26,28,27,0.04)", color: "var(--color-text-secondary)" }}
                >
                  {contact.subject}
                </span>
              </td>

              <td className="px-4 py-3.5">
                <ContactStatusBadge status={contact.status} />
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                  {new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </td>

              <td className="px-4 py-3.5">
                <Link
                  href={ROUTES.CONTACTS.DETAILS(contact.id)}
                  title="View Details"
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-accent-light)] inline-flex"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
