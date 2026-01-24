import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-card">
      <h2 className="text-2xl font-bold text-slate-900">
        찾을 수 없는 페이지에요
      </h2>
      <p className="mt-3 text-sm text-slate-500">
        주소를 다시 확인하거나 홈으로 이동해주세요.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
        홈으로 가기
      </Link>
    </div>
  );
};
