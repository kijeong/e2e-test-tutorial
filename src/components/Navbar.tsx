import { NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

const linkBase =
  "text-sm font-medium text-slate-600 transition hover:text-slate-900";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-lg font-semibold text-slate-900">
          브리즈 스토어
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/products"
            className={linkBase}
            data-testid="nav-products">
            상품
          </NavLink>
          <NavLink to="/cart" className={linkBase} data-testid="nav-cart">
            장바구니
            {itemCount > 0 && (
              <span className="ml-2 rounded-full bg-indigo-500 px-2 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            )}
          </NavLink>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.name} 님</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                로그인
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600">
                회원가입
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
