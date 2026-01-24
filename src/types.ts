export type User = {
  id: number;
  name: string;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
};

export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
};

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  createdAt: string;
};
