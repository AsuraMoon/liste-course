"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";  // Utilisation de `useRouter` et `useSearchParams` de Next.js

const ProfilePage = () => {
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState<string | undefined>(undefined);  // Déclaration d'une variable locale pour l'ID
  const router = useRouter();  // Utilisation de useRouter
  const searchParams = useSearchParams();  // Utilisation de useSearchParams pour accéder aux paramètres de recherche

  useEffect(() => {
    const queryId = searchParams.get("id");  // Récupère l'ID depuis les paramètres de recherche
    if (queryId) {
      setId(queryId);
    }
  }, [searchParams]);

  const fetchUserProfile = async () => {
    if (!id) return; // Assure-toi que l'ID est présent dans l'URL

    setLoading(true);
    setError("");

    try {
      // Vérifie si un utilisateur est connecté via localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/"); // Rediriger vers la page de connexion si non connecté
        return;
      }

      const currentUser = JSON.parse(storedUser);

      if (currentUser.id !== parseInt(id)) {
        // Si l'utilisateur essaie d'accéder à un autre profil
        router.push(`/profile/${currentUser.id}`); // Redirection vers son propre profil
        return;
      }

      // Appelle l'API pour récupérer les données de l'utilisateur connecté
      const res = await fetch(`/api/users?id=${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateUsername = async () => {
    if (!user || !username) {
      setError("Username cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      setUsername("");
      fetchUserProfile(); // Rafraîchit les données
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile(); // Récupère les données du profil utilisateur
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // L'utilisateur sera redirigé dans fetchUserProfile si non connecté
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Votre Profil</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="border p-4 rounded">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Nom d&apos;utilisateur:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nouveau nom d'utilisateur"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={updateUsername}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
