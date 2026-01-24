import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      try {
        const data = await fetchProduct(Number(productId));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "상품을 찾을 수 없어요.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        상품 상세를 불러오는 중이에요...
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error ?? "상품을 찾을 수 없어요."}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <img
        src={product.image}
        alt={product.name}
        className="h-full max-h-[420px] w-full rounded-3xl object-cover shadow-card"
      />
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase text-indigo-500">
            {product.category}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h2>
          <p className="mt-3 text-sm text-slate-600">{product.description}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>재고</span>
            <span>{product.stock}개 남음</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
            <span>평점</span>
            <span>{product.rating.toFixed(1)} / 5.0</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold text-slate-900">
            <span>판매가</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => addItem(product.id, 1)}
              className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
              장바구니 담기
            </button>
          ) : (
            <Link
              to="/login"
              className="mt-4 block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
              로그인 후 담기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
