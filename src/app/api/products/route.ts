import { supabase } from "@/utils/supabase/server"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  }
  catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Convertir les propriétés en PascalCase
    const toTitleCase = (str: string): string =>
      str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      );
    const name = toTitleCase(body.name ?? "");
    const gluten = body.gluten ?? false;
    const lactose = body.lactose ?? false;
    const position = body.position ?? false;

    // Insérer un nouveau produit dans la base de données
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          gluten,
          lactose,
          position,
        },
      ]);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      status: 201,  // Code HTTP pour création réussie
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

