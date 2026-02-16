import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  // On protège toutes les routes API
  if (req.nextUrl.pathname.startsWith("/api/")) {

    // On laisse passer le login (sinon impossible de se connecter)
    if (req.nextUrl.pathname === "/api/login") {
      return NextResponse.next();
    }

    // On laisse passer le logout (sinon impossible de se déconnecter)
    if (req.nextUrl.pathname === "/api/logout") {
      return NextResponse.next();
    }

    // Si pas de session → erreur JSON
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Pour les pages privées
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",          // protège toutes les routes API
    "/productsOwner/:path*", // protège tes pages privées
    "/private/:path*",       // protège tes pages privées
  ],
};
