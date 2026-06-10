"use client";

import { useOrder } from "@/features/orders/hooks/useOrder";
import { useOrderItems } from "@/features/orders/hooks/useOrderItems";
import { useUpdateOrderStatus } from "@/features/orders/hooks/useUpdateOrderStatus";
import { OrderDetails, OrderDetailsSkeleton } from "@/components/order";
import { OrderStatus } from "@/constants/enums";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface OrderDetailsClientProps {
  id: string;
}

export function OrderDetailsClient({ id }: OrderDetailsClientProps) {
  const { data, isLoading, isError } = useOrder(id);
  const { data: orderItems, isLoading: isItemsLoading } = useOrderItems(id);
  const updateStatusMutation = useUpdateOrderStatus(id);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleUpdateStatus(status: OrderStatus) {
    try {
      await updateStatusMutation.mutateAsync({ orderStatus: status });
      showToast("success", "Order status updated successfully.");
    } catch {
      showToast("error", "Failed to update status. Please try again.");
    }
  }

  if (isLoading) return <OrderDetailsSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 px-8">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M11 7v5M11 14v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[15px] font-medium text-[#1a1c1b]">Order not found</p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          This order may have been removed or the ID is incorrect.
        </p>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg",
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#22c55e" opacity="0.15" />
              <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.15" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
      <OrderDetails
        order={data}
        orderItems={orderItems}
        isItemsLoading={isItemsLoading}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}
