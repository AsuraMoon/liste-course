import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { supabase } from "@/utils/server";

// Cette route est appelée quand ton front fait un POST vers /api/auth/login
export async function POST(req: Request) {
  // On récupère le body envoyé par le client (username + password)
  const { username, password } = await req.json();

  // Si un champ manque → erreur
  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 1) HASH DU USERNAME
  // Tu ne stockes pas le username en clair dans la base,
  // donc tu dois le hasher AVANT de faire la requête.
  const usernameHash = crypto
    .createHash("sha256")
    .update(username)
    .digest("hex");

  // 2) RÉCUPÉRATION DE L’UTILISATEUR
  // On cherche dans Supabase un user dont le username hashé correspond.
  // .single() = on veut exactement une ligne (sinon erreur)
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", usernameHash)
    .single();

  // Si aucun user trouvé → mauvais username
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // 3) VÉRIFICATION DU MOT DE PASSE
  // bcrypt.compare() compare le password entré avec le hash stocké.
  // Ça marche même si le hash change à chaque génération.
  const ok = await bcrypt.compare(password, user.password);

  // Si le mot de passe ne correspond pas → erreur
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // 4) CRÉATION DU COOKIE DE SESSION
  // On crée un cookie HttpOnly contenant l'ID du user.
  // HttpOnly = inaccessible en JS → sécurisé
  // secure = seulement HTTPS
  // sameSite strict = anti-CSRF
  const response = NextResponse.json({ success: true });

  response.cookies.set("session", user.id, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 jours
  });

  // On renvoie la réponse avec le cookie attaché
  return response;
}
