import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";  // Supabase client pour la base de données

// Récupération des utilisateurs
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// Récupération d'un utilisateur par ID
export async function GET_USER(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);  // Récupération des paramètres de l'URL
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("users").select().eq("id", id).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// Mise à jour d'un utilisateur
export async function PUT(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, username, email, password_hash } = body;

  if (!id || (!username && !email && !password_hash)) {
    return NextResponse.json(
      { error: "Missing required fields: id and at least one field to update" },
      { status: 400 }
    );
  }

  // Restrictions pour l'utilisateur Démo (id = 2)
  if (id === 2) {
    if (!username || email || password_hash) {
      return NextResponse.json(
        { error: "Demo user can only update their username." },
        { status: 403 }
      );
    }
  }

  const updateFields: any = {};
  if (username) updateFields.username = username;
  if (email && id !== 2) updateFields.email = email; // Bloque la modification pour Démo
  if (password_hash && id !== 2) updateFields.password_hash = password_hash; // Bloque la modification pour Démo

  const { data, error } = await supabase
    .from("users")
    .update(updateFields)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// Suppression d'un utilisateur
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  // Interdit la suppression du profil Démo (id = 2)
  if (id === 2) {
    return NextResponse.json(
      { error: "Demo user cannot be deleted." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
