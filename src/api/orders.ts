import { request } from "./client";
import type { Order, OrderItem } from "../types";

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const createOrder = async (
  userId: number,
  items: OrderItem[],
  total: number,
) => {
  await delay(3000);
  return request<Order>("/orders", {
    method: "POST",
    json: {
      userId,
      items,
      total,
      createdAt: new Date().toISOString(),
    },
  });
};
