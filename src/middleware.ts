import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const user = req.cookies.get("user");

  if (!user && !req.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shoppingList/:path*", "/profile/:path*", "/users/:path*"],
};
