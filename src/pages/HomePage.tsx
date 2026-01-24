import { Link } from "react-router-dom";

const features = [
  "다양한 카테고리의 큐레이션 상품",
  "실시간 재고와 빠른 배송 안내",
  "간편 결제와 주문 내역 관리",
];

export const HomePage = () => {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="space-y-6">
        <p className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Breeze Shop
        </p>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          일상에 필요한 모든 것을
          <br />한 번에 준비하세요.
        </h1>
        <p className="text-lg text-slate-600">
          실습용 쇼핑몰이지만 실제 서비스 같은 플로우로 구성했어요. 오늘의 추천
          상품부터 결제까지 부드럽게 이어집니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
            상품 둘러보기
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
            회원가입하기
          </Link>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">
          왜 브리즈 스토어인가요?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          E2E 테스트에 필요한 핵심 플로우를 한 곳에 모았습니다.
        </p>
        <ul className="mt-6 space-y-4 text-sm text-slate-600">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          데모 계정으로 로그인하면 장바구니와 결제 플로우까지 확인할 수 있어요.
        </div>
      </section>
    </div>
  );
};
