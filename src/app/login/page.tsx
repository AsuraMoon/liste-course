"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur inconnue");
      return;
    }

    router.push("/productsOwner");
  }

  return (
    <div className="responsive-container">
      <div className="responsive-card" style={{ maxWidth: "400px", margin: "80px auto" }}>
        <h1 className="card-title">Connexion</h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "15px" }}>
            Nom d'utilisateur
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="search-input"
              required
            />
          </label>

          <label style={{ display: "block", marginBottom: "15px" }}>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input"
              required
            />
          </label>

          {error && (
            <p style={{ color: "var(--quaternary-color)", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <button type="submit" className="secondary-button" style={{ width: "100%" }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
