"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // États pour stocker les valeurs du formulaire
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Pour afficher une erreur éventuelle
  const [error, setError] = useState("");

  // Pour rediriger après login
  const router = useRouter();

  // Fonction appelée quand on soumet le formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Empêche le rechargement de la page

    setError(""); // Reset des erreurs

    // On appelle ton API login
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // On envoie username + password
      body: JSON.stringify({ username, password }),
    });

    // Si l'API renvoie une erreur → on l'affiche
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur inconnue");
      return;
    }

    // Si tout est bon → redirection vers ta page privée
    router.push("/productsOwner");
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Connexion
      </h1>

      {/* Formulaire de login */}
      <form onSubmit={handleSubmit}>

        {/* Champ username */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Nom d'utilisateur
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </label>

        {/* Champ password */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </label>

        {/* Message d'erreur */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        {/* Bouton de connexion avec ta classe secondary-button */}
        <button
          type="submit"
          className="secondary-button"
          style={{ width: "100%", marginTop: "10px" }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
