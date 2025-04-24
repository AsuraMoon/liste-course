"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import crypto from "crypto";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fonction de hashage SHA-256
  const hashPassword = (password: string): string => {
    return crypto.createHash("sha256").update(password).digest("hex");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Hashage du mot de passe avant l'envoi
      const hashedPassword = hashPassword(password);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: hashedPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Stocke les informations de l'utilisateur dans localStorage ou dans un contexte
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirige vers la liste de courses
      if (data.user.id === 1) {
        router.push("/shoppingList");
      } else if (data.user.id === 2) {
        router.push("/shoppingList");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
