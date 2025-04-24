"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  interface User {
    id: number;
    username: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const fetchUserProfile = async () => {
    setLoading(true);
    setError("");

    try {
      // Vérifie si un utilisateur est connecté via localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/");
        return;
      }

      const currentUser = JSON.parse(storedUser);

      // Appelle l'API pour récupérer les données de l'utilisateur connecté
      const res = await fetch(`/api/users/${currentUser.id}`);
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
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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
    fetchUserProfile();
  }, [router]);

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
          <strong>Nom d'utilisateur:</strong> {user.username}
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
