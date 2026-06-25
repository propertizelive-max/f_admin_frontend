import { Sidebar } from "@/components/layout";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <AuthBootstrap />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
