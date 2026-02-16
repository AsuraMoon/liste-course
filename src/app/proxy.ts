import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Le proxy remplace le middleware.
// Il intercepte toutes les requêtes définies dans "config.matcher".
export function proxy(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  const path = req.nextUrl.pathname;

  // --- EXCEPTIONS : login et logout doivent être accessibles ---
  if (path === "/api/login" || path === "/api/logout") {
    return NextResponse.next();
  }

  // --- PROTECTION DES ROUTES API ---
  if (path.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // --- PROTECTION DES PAGES PRIVÉES ---
  if (
    path.startsWith("/productsOwner") ||
    path.startsWith("/private")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Liste des routes interceptées par le proxy
export const config = {
  matcher: [
    "/api/:path*",
    "/productsOwner/:path*",
    "/private/:path*",
  ],
};
