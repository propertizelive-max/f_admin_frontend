"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { ContactTable, ContactTableSkeleton } from "@/components/contact";
import { ContactStatus } from "@/types/backend.types";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { useDebounce } from "@/hooks/useDebounce";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {direction === "left" ? (
        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "New",        value: ContactStatus.NEW },
  { label: "Read",       value: ContactStatus.READ },
  { label: "Replied",    value: ContactStatus.REPLIED },
];

const PAGE_SIZE = 10;

export function ContactListClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "">("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isError } = useContacts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  const contacts = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const hasSearch = !!(debouncedSearch || statusFilter);

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      <PageHeader
        label="Support"
        title="Contacts"
        subtitle="View and manage customer contact submissions"
      />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }}>
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-lg border outline-none transition-colors bg-white text-[#1a1c1b] placeholder:text-[#9a9b9b]"
              style={{ borderColor: "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as ContactStatus | ""); setPage(1); }}
              className="pl-3.5 pr-8 py-2 text-[13px] rounded-lg border outline-none appearance-none cursor-pointer bg-white text-[#1a1c1b] transition-colors"
              style={{ borderColor: "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {!isLoading && (
            <span className="ml-auto text-[12px] shrink-0" style={{ color: "var(--color-text-muted)" }}>
              {total} {total === 1 ? "contact" : "contacts"}
            </span>
          )}
        </div>

        {isLoading ? (
          <ContactTableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M10 6v5M10 13v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-[#1a1c1b]">Failed to load contacts</p>
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Check your connection and try again.</p>
          </div>
        ) : (
          <ContactTable contacts={contacts} hasSearch={hasSearch} />
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-40 hover:bg-[rgba(26,28,27,0.06)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <ChevronIcon direction="left" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-[12px] font-medium transition-colors"
                    style={p === page ? { background: "var(--color-accent)", color: "white" } : { color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "rgba(26,28,27,0.06)"; }}
                    onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = ""; }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-40 hover:bg-[rgba(26,28,27,0.06)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
