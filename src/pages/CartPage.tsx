import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { formatCurrency } from "../utils/format";

export const CartPage = () => {
  const { user } = useAuth();
  const {
    items,
    loading,
    checkoutLoading,
    updateItem,
    removeItem,
    checkout,
    totalPrice,
  } = useCart();
  const [message, setMessage] = useState("");
  const isEmpty = items.length === 0;
  const isCheckoutDisabled = isEmpty || checkoutLoading;

  const handleCheckout = async () => {
    setMessage("");
    await checkout();
    setMessage("주문이 완료되었어요. 감사합니다!");
  };

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card">
        <h2 className="text-2xl font-bold text-slate-900">
          로그인 후 이용할 수 있어요
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          장바구니를 사용하려면 로그인해주세요.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-500">Cart</p>
            <h2 className="text-2xl font-bold text-slate-900">장바구니 목록</h2>
          </div>
          <span className="text-sm text-slate-500">{items.length}개 상품</span>
        </div>
        {loading && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            장바구니를 불러오는 중이에요...
          </div>
        )}
        {!loading && isEmpty && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            장바구니가 비어 있어요. 상품을 담아보세요.
          </div>
        )}
        {!loading &&
          items.map((item) => (
            <div
              key={item.id}
              data-testid="cart-item"
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:flex-row sm:items-center">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  to={`/products/${item.product.id}`}
                  className="text-lg font-semibold text-slate-900">
                  {item.product.name}
                </Link>
                <p className="text-sm text-slate-500">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(item.id, Number(event.target.value))
                  }
                  className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
                  삭제
                </button>
              </div>
            </div>
          ))}
      </section>
      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-slate-900">결제 요약</h3>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>상품 합계</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>배송비</span>
            <span>{totalPrice > 0 ? "무료" : "-"}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-base font-semibold text-slate-900">
          <span>총 결제금액</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <button
          data-testid="checkout-button"
          type="button"
          onClick={handleCheckout}
          disabled={isCheckoutDisabled}
          className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
            isCheckoutDisabled
              ? isEmpty
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "cursor-wait bg-indigo-500"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}>
          {checkoutLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              결제 진행 중...
            </span>
          ) : (
            "구매하기"
          )}
        </button>
        {checkoutLoading && (
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
            결제 처리를 위해 잠시만 기다려주세요.
          </p>
        )}
        {message && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            {message}
          </p>
        )}
      </aside>
    </div>
  );
};
