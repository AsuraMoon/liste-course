// app/api/shoppingList/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Récupérer la liste de courses d'un utilisateur
export async function GET(req: NextRequest) {
  const { user_id } = req.query;
  const supabase = await createClient();

  const { data: shoppingList, error } = await supabase
    .from("shopping_list_items")
    .select("products(id, name, contains_allergens)")
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(shoppingList, { status: 200 });
}

// Ajouter un produit à la liste de courses
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { user_id, product_id } = body;

  if (!user_id || !product_id) {
    return NextResponse.json(
      { error: "Missing required fields: user_id, product_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("shopping_list_items")
    .insert([{ user_id, product_id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// Retirer un produit de la liste de courses
export async function DELETE(req: NextRequest) {
  const { user_id, product_id } = req.query;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", user_id)
    .eq("product_id", product_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
