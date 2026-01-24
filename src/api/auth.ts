import { request } from "./client";
import type { User } from "../types";

type UserRecord = User & {
  password: string;
  createdAt: string;
};

export const login = async (email: string, password: string) => {
  const users = await request<UserRecord[]>(
    `/users?email=${encodeURIComponent(email)}`,
  );
  const matched = users.find((user) => user.password === password);
  if (!matched) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않아요.");
  }
  const { id, name } = matched;
  return { id, name, email };
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await request<UserRecord[]>(
    `/users?email=${encodeURIComponent(payload.email)}`,
  );
  if (existing.length > 0) {
    throw new Error("이미 가입된 이메일이에요.");
  }
  const created = await request<UserRecord>("/users", {
    method: "POST",
    json: {
      ...payload,
      createdAt: new Date().toISOString(),
    },
  });
  return { id: created.id, name: created.name, email: created.email };
};
