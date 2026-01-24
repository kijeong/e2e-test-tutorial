import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as cartApi from "../api/cart";
import * as orderApi from "../api/orders";
import { fetchProducts } from "../api/products";
import type { CartItemWithProduct, OrderItem } from "../types";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  items: CartItemWithProduct[];
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  checkout: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const hydrate = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const [cartItems, products] = await Promise.all([
        cartApi.fetchCartItems(user.id),
        fetchProducts(),
      ]);
      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );
      const hydrated = cartItems
        .map((item) => {
          const product = productMap.get(item.productId);
          if (!product) return null;
          return { ...item, product };
        })
        .filter((item): item is CartItemWithProduct => item !== null);
      setItems(hydrated);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addItem = async (productId: number, quantity = 1) => {
    if (!user) return;
    await cartApi.addToCart(user.id, productId, quantity);
    await hydrate();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await cartApi.removeCartItem(itemId);
    } else {
      await cartApi.updateCartItem(itemId, quantity);
    }
    await hydrate();
  };

  const removeItem = async (itemId: number) => {
    if (!user) return;
    await cartApi.removeCartItem(itemId);
    await hydrate();
  };

  const checkout = async () => {
    if (!user || items.length === 0) return;
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    await orderApi.createOrder(user.id, orderItems, total);
    await cartApi.clearCart(user.id);
    await hydrate();
  };

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return {
      items,
      loading,
      refresh: hydrate,
      addItem,
      updateItem,
      removeItem,
      checkout,
      itemCount,
      totalPrice,
    };
  }, [items, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("CartProvider가 필요해요.");
  }
  return ctx;
};
