import { OrderStatus } from "@/types/backend.types";

export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]:    [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]:    [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]:  [],
  [OrderStatus.CANCELLED]:  [],
};

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return VALID_ORDER_TRANSITIONS[current] ?? [];
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return VALID_ORDER_TRANSITIONS[status].length === 0;
}
