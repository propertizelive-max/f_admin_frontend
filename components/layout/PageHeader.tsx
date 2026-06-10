import { cn } from "@/utils/cn";

interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ label, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-8", className)}>
      <div>
        {label && (
          <p
            className="text-[11px] font-medium tracking-widest uppercase mb-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {label}
          </p>
        )}
        <h1
          className="text-[28px] font-normal leading-tight text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-molengo), serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {actions}
        </div>
      )}
    </div>
  );
}
