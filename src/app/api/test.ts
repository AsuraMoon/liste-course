import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/server";

console.log("Supabase Client Test:", supabase);
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "API is working!" });
}
