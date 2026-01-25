import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
      data-testid={`product-card-${product.id}`}>
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-500">
              {product.category}
            </p>
            <Link
              to={`/products/${product.id}`}
              className="mt-1 block text-lg font-semibold text-slate-900">
              {product.name}
            </Link>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            {product.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {user ? (
            <button
              type="button"
              onClick={() => addItem(product.id, 1)}
              data-testid={`add-to-cart-${product.id}`}
              className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600">
              장바구니 담기
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
              로그인 후 담기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
