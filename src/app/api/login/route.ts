import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { supabase } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const usernameHash = crypto
    .createHash("sha256")
    .update(username)
    .digest("hex");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", usernameHash)
    .single();

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  // 🔥 Cookie compatible local + Vercel
  response.cookies.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // obligatoire sur Vercel
    sameSite: "lax", // strict bloque certaines redirections
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return response;
}
