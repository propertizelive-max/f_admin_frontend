import { cn } from "@/utils/cn";

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function TopAppBar({ title, subtitle, actions, className }: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-8 h-[56px]",
        className
      )}
      style={{
        background: "rgba(249, 249, 247, 0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <h1
          className="text-[20px] font-normal text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-molengo), serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <>
            <div
              className="w-px h-4 shrink-0"
              style={{ background: "var(--color-border)" }}
            />
            <span className="text-[12px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {subtitle}
            </span>
          </>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-4">
          {actions}
        </div>
      )}
    </header>
  );
}
