import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const token = request.cookies.get("access_token")?.value;

	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	const isAuthRoute = authRoutes.some((route) =>
		pathname.startsWith(route)
	);

	// Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
	if (isProtectedRoute && !token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
	if (isAuthRoute && token) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/auth/:path*"],
};
