import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Gestion de la requête GET
export async function GET() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from("users").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(users, { status: 200 });
}

// Gestion de la requête POST
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { username, email, password_hash } = body;

  if (!username || !email || !password_hash) {
    return NextResponse.json(
      { error: "Missing required fields: username, email, password_hash" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password_hash }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
