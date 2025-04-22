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
    .update(body)
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
