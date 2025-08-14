import { supabase } from "@/utils/supabase/server";

export async function GET() {
  const { error } = await supabase
    .from("system_heartbeat")
    .insert({ last_ping: new Date().toISOString() });

  if (error) {
    return new Response(JSON.stringify({ status: "error", error }), { status: 500 });
  }

  return new Response(JSON.stringify({ status: "alive", timestamp: new Date().toISOString() }), { status: 200 });
}