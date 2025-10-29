import { supabase } from "@/utils/supabase/server";

export async function GET() {
  try {
    // retourne uniquement les items marqués to_buy=true avec les données produit jointes
    const { data, error } = await supabase
      .from("shopping_owner_list_items")
      .select("product_id, to_buy, products_owner (id, name, position)")
      .eq("to_buy", true);

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("An error occurred:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { product_id } = body;
    if (!product_id) return new Response("Bad Request", { status: 400 });

    const { data, error } = await supabase
      .from("shopping_owner_list_items")
      .update({ to_buy: false })
      .eq("product_id", product_id)
      .select("product_id, to_buy, products_owner (id, name, position)");

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("An error occurred:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id } = body;
    if (!product_id) return new Response("Bad Request", { status: 400 });

    // upsert: nécessite un index unique sur product_id dans shopping_owner_list_items
    const { data, error } = await supabase
      .from("shopping_owner_list_items")
      .upsert([{ product_id, to_buy: true }], { onConflict: "product_id" })
      .select("product_id, to_buy, products_owner (id, name, position)");

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (err) {
    console.error("An error occurred:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
