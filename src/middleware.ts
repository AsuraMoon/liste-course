import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Le middleware s'exécute AVANT d'accéder à certaines routes/pages.
// Ici, on va protéger TOUTES les routes API.
export function middleware(req: NextRequest) {
  // On récupère le cookie "session" (créé au login)
  const session = req.cookies.get("session")?.value;

  // Si pas de session → l'utilisateur n'est pas connecté
  if (!session) {
    // Pour une API, on renvoie une erreur JSON propre
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Pour une page → redirection vers /login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si session présente → accès autorisé
  return NextResponse.next();
}

// Ici, on définit TOUT ce que le middleware doit protéger.
// "/api/:path*" = toutes les routes API
// Tu peux ajouter d'autres chemins si tu veux protéger des pages aussi.
export const config = {
  matcher: [
    "/api/:path*",         // protège toutes les routes API
    "/productsOwner/:path*", // protège tes pages privées
    "/private/:path*",       // protège tes pages privées
  ],
};
