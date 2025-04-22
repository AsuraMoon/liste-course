import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(products, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const {name, desc, con_allerg} = body;

  if (!name || !desc || !con_allerg) {
    return NextResponse.json(
      { error: "Missing required fields: name, desc, con_allerg" },
      { status: 400 }
    );
  }