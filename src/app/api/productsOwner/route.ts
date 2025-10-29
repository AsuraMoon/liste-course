import { supabase } from "@/utils/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products_owner")
      .select("*");

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const toTitleCase = (str: string): string =>
      str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      );

    const name = toTitleCase(body.name ?? "");

    // position doit être une des 4 valeurs autorisées
    const allowedPositions = ["haut", "bas_sec", "bas_surgele", "bas_frais"];
    const position = allowedPositions.includes(body.position)
      ? body.position
      : "haut"; // valeur par défaut si invalide

    const { data, error } = await supabase
      .from("products_owner")
      .insert([{ name, position }]);

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
