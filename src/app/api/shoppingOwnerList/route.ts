import { supabase } from "@/utils/supabase/server";

export async function GET() {
  try {
    const { data : products_owner , error } = await supabase
      .from("products_owner")
      .select(`
        id,
        name,
        position,
        shopping_owner_list_items!inner(to_buy)
      `)
      .eq("shopping_owner_list_items.to_buy", true);

    if (error) throw error;

    const result = products_owner.map(item => ({
      id: item.id,
      name: item.name,
      position: item.position,
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product_id = body.product_id;

    if (!product_id) {
      return new Response("Product ID missing", { status: 400 });
    }

    // Met à jour uniquement to_buy = true dans shopping_owner_list_items
    const { data, error } = await supabase
      .from("shopping_owner_list_items")
      .update({ to_buy: false })
      .eq("product_id", product_id);

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
