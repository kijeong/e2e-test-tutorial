const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type RequestOptions = RequestInit & {
  json?: unknown;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const request = async <T>(
  path: string,
  options: RequestOptions = {},
) => {
  const { json, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json ? JSON.stringify(json) : rest.body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || "요청에 실패했어요.", response.status);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};
