import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export const SignupPage = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signup({ name, email, password });
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했어요.");
    }
  };

  if (user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card">
        <h2 className="text-2xl font-bold text-slate-900">
          이미 가입되어 있어요
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          로그인 상태로 상품 목록을 확인해보세요.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
          상품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
      <h2 className="text-2xl font-bold text-slate-900">회원가입</h2>
      <p className="mt-2 text-sm text-slate-500">
        이메일로 빠르게 가입하고 추천 상품을 받아보세요.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-600">
          이름
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
            placeholder="홍길동"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-600">
          이메일
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-600">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
            placeholder="8자 이상"
          />
        </label>
        {error && (
          <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
          회원가입 완료하기
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-semibold text-indigo-500">
          로그인
        </Link>
      </p>
    </div>
  );
};
