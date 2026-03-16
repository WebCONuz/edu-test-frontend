import { API_URL } from "./constants";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
  _retry?: boolean;
};

async function refreshTokens() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, _retry = false, ...rest } = options;

  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, String(value)),
    );
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...rest,
  });

  // 401 kelsa va retry qilinmagan bo'lsa
  if (res.status === 401 && !_retry) {
    try {
      await refreshTokens();
      // Yangi token bilan qayta urinish
      return fetcher<T>(endpoint, { ...options, _retry: true });
    } catch {
      // Refresh ham ishlamasa — loginga yuborish
      window.location.href = "/login";
      throw new Error("Session tugadi");
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Xatolik yuz berdi");
  }

  return res.json();
}
