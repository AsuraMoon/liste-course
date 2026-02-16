import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get("session");

  /* ------------------------------
     ROUTES PUBLIQUES (GUEST)
  ------------------------------ */
  const publicPrefixes = [
    "/productsGuest",
    "/shoppingGuestList",
    "/api/productsGuest",
    "/api/shoppingGuestList",
    "/login",
    "/api/login",
    "/",
  ];

  // Si la route commence par un préfixe public → laisser passer
  if (publicPrefixes.some((prefix) => url.startsWith(prefix))) {
    return NextResponse.next();
  }

  /* ------------------------------
     ROUTES PROTÉGÉES (OWNER)
  ------------------------------ */
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

/* ------------------------------
   MATCHER : appliquer le middleware
------------------------------ */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
