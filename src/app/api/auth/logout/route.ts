"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Suppression des données de session
    localStorage.removeItem("user");
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Redirection vers la page d'accueil après un court délai pour assurer que les actions sont terminées
    setTimeout(() => {
      router.push("/");
    }, 100);
  }, [router]);

  return (null);
};

export default LogoutPage;
