import { NextResponse } from "next/server";

// Cette route est appelée quand l'utilisateur clique sur "logout"
export async function POST() {
  // On prépare une réponse JSON
  const res = NextResponse.json({ success: true });

  // On supprime le cookie "session"
  res.cookies.set("session", "", {
    httpOnly: true,   // toujours sécurisé
    secure: true,     // HTTPS obligatoire
    sameSite: "strict",
    path: "/",
    maxAge: 0,        // 0 = suppression immédiate
  });

  return res;
}
