import { request } from "./client";
import type { CartItem } from "../types";

export const fetchCartItems = (userId: number) =>
  request<CartItem[]>(`/cartItems?userId=${userId}`);

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number,
) => {
  const existing = await request<CartItem[]>(
    `/cartItems?userId=${userId}&productId=${productId}`,
  );
  if (existing.length > 0) {
    const item = existing[0];
    return request<CartItem>(`/cartItems/${item.id}`, {
      method: "PATCH",
      json: {
        quantity: item.quantity + quantity,
      },
    });
  }
  return request<CartItem>("/cartItems", {
    method: "POST",
    json: {
      userId,
      productId,
      quantity,
    },
  });
};

export const updateCartItem = (id: number, quantity: number) =>
  request<CartItem>(`/cartItems/${id}`, {
    method: "PATCH",
    json: { quantity },
  });

export const removeCartItem = (id: number) =>
  request<void>(`/cartItems/${id}`, {
    method: "DELETE",
  });

export const clearCart = async (userId: number) => {
  const items = await fetchCartItems(userId);
  await Promise.all(items.map((item) => removeCartItem(item.id)));
};
