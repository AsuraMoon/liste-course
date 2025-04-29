import { supabase } from "@/utils/supabase/server";

export async function GET() {
  try {
    // Récupérer tous les produits marqués comme "à acheter"
    const { data, error } = await supabase
      .from("shopping_list_items")
      .select("product_id, products(name)")
      .eq("to_buy", true)

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { product_id } = body;

    // Mettre à jour "to_buy" à false pour retirer un produit de la liste
    const { data, error } = await supabase
      .from("shopping_list_items")
      .update({ to_buy: false })
      .eq("product_id", product_id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id } = body;

    // Ajouter ou mettre à jour un produit dans la liste de courses
    const { data, error } = await supabase
      .from("shopping_list_items")
      .upsert([{ product_id, to_buy: true }], { onConflict: "product_id" });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
