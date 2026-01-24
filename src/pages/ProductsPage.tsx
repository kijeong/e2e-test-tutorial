import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "상품을 불러오지 못했어요.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-500">Products</p>
          <h2 className="text-2xl font-bold text-slate-900">
            오늘의 추천 상품
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
          총 {products.length}개 상품
        </div>
      </header>

      {loading && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          상품 정보를 불러오는 중이에요...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          등록된 상품이 없어요.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
};
