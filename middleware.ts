import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/student", "/", "/forgot-password", "/reset-password"];
const AUTH_ROUTES = ["/login", "/register"];

function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: { exp: number }) {
  return payload.exp * 1000 < Date.now();
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublic) return NextResponse.next();

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload && !isTokenExpired(payload)) {
        return NextResponse.redirect(
          new URL(
            payload.role === "teacher"
              ? "/teacher/dashboard"
              : "/admin/dashboard",
            request.url,
          ),
        );
      }
    }
    return NextResponse.next();
  }

  // Token yo'q
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // access_token bor va valid
  if (accessToken) {
    const payload = parseJwt(accessToken);
    if (payload && !isTokenExpired(payload)) {
      // Role tekshiruv
      if (pathname.startsWith("/admin") && payload.role === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url),
        );
      }
      if (pathname.startsWith("/teacher") && payload.role !== "teacher") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }
  }

  // access_token expired, refresh_token bor — refresh qilish
  if (refreshToken) {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "GET",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (res.ok) {
        // Backend yangi cookie larni Set-Cookie headerda qaytaradi
        const response = NextResponse.next();
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
          response.headers.set("set-cookie", setCookie);
        }
        return response;
      }
    } catch {
      // Refresh ishlamasa login ga
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public).*)"],
};
