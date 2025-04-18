import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérification du type de méthode HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Récupération des données de la requête
  const { username, email, password_hash } = req.body;

  // Vérification de la validité des données
  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insertion dans la table "users"
    const { data, error } = await supabase.from("users").insert([{ username, email, password_hash }]);
    if (error) throw error;

    // Retour de la réponse avec les données de l'utilisateur créé
    res.status(201).json({ success: true, user: data });
  } catch (error) {
    // Gestion des erreurs
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
