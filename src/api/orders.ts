import { request } from "./client";
import type { Order, OrderItem } from "../types";

export const createOrder = (
  userId: number,
  items: OrderItem[],
  total: number,
) =>
  request<Order>("/orders", {
    method: "POST",
    json: {
      userId,
      items,
      total,
      createdAt: new Date().toISOString(),
    },
  });
