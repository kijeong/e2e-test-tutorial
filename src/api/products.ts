import { request } from "./client";
import type { Product } from "../types";

export const fetchProducts = () => request<Product[]>("/products");

export const fetchProduct = (id: number) => request<Product>(`/products/${id}`);
