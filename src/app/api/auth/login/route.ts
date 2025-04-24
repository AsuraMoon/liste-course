import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  // Hashage du mot de passe reçu
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  // Vérification dans la base de données
  const { data: user, error } = await (await supabase)
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user || user.password_hash !== hashedPassword) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Retourne les informations utilisateur si tout est correct
  return NextResponse.json({ user }, { status: 200 });
}
