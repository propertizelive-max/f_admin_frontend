"use client";

import Link from "next/link";
import { useContact } from "@/features/contacts/hooks/useContact";
import { PageHeader } from "@/components/layout";
import { ROUTES } from "@/constants/routes";
import { ContactStatus } from "@/types/backend.types";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  [ContactStatus.NEW]:     { label: "New",     color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  [ContactStatus.READ]:    { label: "Read",    color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  [ContactStatus.REPLIED]: { label: "Replied", color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
};

function DetailsSkeleton() {
  return (
    <div className="px-8 py-7 max-w-[900px] mx-auto animate-pulse">
      <div className="h-5 w-32 rounded bg-[rgba(26,28,27,0.07)] mb-6" />
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div className="h-4 w-48 rounded bg-[rgba(26,28,27,0.07)]" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-3 w-24 rounded bg-[rgba(26,28,27,0.07)] shrink-0" />
              <div className="h-3 flex-1 rounded bg-[rgba(26,28,27,0.05)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ContactDetailsClientProps {
  id: string;
}

export function ContactDetailsClient({ id }: ContactDetailsClientProps) {
  const { data: contact, isLoading, isError } = useContact(id);

  if (isLoading) return <DetailsSkeleton />;

  if (isError || !contact) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 px-8">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M11 7v5M11 14v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[15px] font-medium text-[#1a1c1b]">Contact not found</p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          This contact may have been removed or the ID is incorrect.
        </p>
        <Link
          href={ROUTES.CONTACTS.LIST}
          className="mt-2 text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ background: "var(--color-accent)", color: "white" }}
        >
          Back to Contacts
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[contact.status] ?? STATUS_CONFIG[ContactStatus.NEW];

  return (
    <div className="px-8 py-7 max-w-[900px] mx-auto">
      <div className="mb-5">
        <Link
          href={ROUTES.CONTACTS.LIST}
          className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Contacts
        </Link>
      </div>

      <PageHeader
        label="Support"
        title="Contact Details"
        subtitle={`Submission from ${contact.fullName}`}
      />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-white shrink-0"
              style={{ background: "var(--color-accent)" }}
            >
              {contact.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#1a1c1b]">{contact.fullName}</p>
              <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                {new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
            style={{ color: statusCfg.color, background: statusCfg.bg }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusCfg.dot }} />
            {statusCfg.label}
          </span>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase mb-4" style={{ color: "var(--color-text-muted)" }}>
            Contact Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={contact.fullName} />
            <InfoRow label="Email" value={contact.email} isLink={`mailto:${contact.email}`} />
            <InfoRow label="Phone" value={contact.phoneNumber} isLink={`tel:${contact.phoneNumber}`} />
            <InfoRow label="Subject" value={contact.subject} capitalize />
          </div>
        </div>

        {/* Message */}
        <div className="px-6 py-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--color-text-muted)" }}>
            Message
          </p>
          <p className="text-[14px] leading-relaxed text-[#1a1c1b] whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>

        {/* Meta */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            <MetaItem label="Submitted" value={new Date(contact.createdAt).toLocaleString("en-IN")} />
            <MetaItem label="Last Updated" value={new Date(contact.updatedAt).toLocaleString("en-IN")} />
            <MetaItem label="ID" value={contact.id.slice(0, 8).toUpperCase()} mono />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, isLink, capitalize }: { label: string; value: string; isLink?: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      {isLink ? (
        <a
          href={isLink}
          className="text-[13px] font-medium transition-colors"
          style={{ color: "var(--color-accent)" }}
        >
          {value}
        </a>
      ) : (
        <p className={`text-[13px] font-medium text-[#1a1c1b] ${capitalize ? "capitalize" : ""}`}>{value}</p>
      )}
    </div>
  );
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      <p className={`text-[12px] mt-0.5 ${mono ? "font-mono" : ""}`} style={{ color: "var(--color-text-secondary)" }}>{value}</p>
    </div>
  );
}
