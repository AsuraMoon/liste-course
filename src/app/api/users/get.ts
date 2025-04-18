import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérification du type de méthode HTTP
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Récupération de tous les utilisateurs depuis la table "users"
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;

    // Retour des utilisateurs sous forme de réponse JSON
    res.status(200).json({ success: true, users: data });
  } catch (error) {
    // Gestion des erreurs
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
