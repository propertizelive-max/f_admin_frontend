import { cn } from "@/utils/cn";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, badge, children, className }: ChartCardProps) {
  return (
    <div
      className={cn("bg-white rounded-2xl border p-5", className)}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1a1c1b]">{title}</h3>
          {subtitle && (
            <p className="text-[12px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

export function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-white rounded-2xl border p-5 animate-pulse", className)}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="w-40 h-5 rounded bg-gray-100 mb-1" />
      <div className="w-24 h-3.5 rounded bg-gray-100 mb-5" />
      <div className="h-[220px] rounded-xl bg-gray-50" />
    </div>
  );
}
