import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
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

// Gestion de la requête GET : Récupérer tous les utilisateurs
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from("users").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(users, { status: 200 });
}

// Gestion de la requête PUT : Mise à jour d'un utilisateur
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

// Gestion de la requête DELETE : Suppression d'un utilisateur
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
