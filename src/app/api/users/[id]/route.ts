import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PUT : Mettre à jour un utilisateur
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;
  const body = await req.json();

  const { email, username, password_hash } = body;

  const { data, error } = await supabase
    .from("users")
    .update({ email, username, password_hash })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// DELETE : Supprimer un utilisateur
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
//GET : Voir un utilisateur
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  // Récupérer un utilisateur par son ID
  const { data: user, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single(); // `single()` garantit qu'on récupère un seul utilisateur

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}