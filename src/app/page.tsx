"use client"; 
// Indique à Next.js que ce composant doit être rendu côté client.
// Nécessaire car on utilise useRouter() et des handlers onClick.

import { useRouter } from "next/navigation"; 
// Hook de navigation côté client (App Router).

import Image from "next/image"; 
// Composant Image optimisé de Next.js (lazy loading, formats modernes, optimisation auto).

import styles from "./home.module.css"; 
// Import du module CSS local pour styliser la page.

const HomePage = () => {
  const router = useRouter(); 
  // Initialisation du router pour pouvoir naviguer entre les pages.

  const handleOwner = () => router.push("/login");
  // Redirige l'utilisateur vers l'espace propriétaire (connexion).

  const handleGuest = () => router.push("/productsGuest");
  // Redirige vers la version démo / invité.

  return (
    <div className={styles.homeContainer}>
      {/* Conteneur principal de la page, centré et stylisé via home.module.css */}

      <h1 className={styles.homeTitle}>MiamList</h1>
      {/* Titre principal de la page d'accueil */}

      <Image
        src="/bread.png" 
        // Image stockée dans /public, optimisée automatiquement par Next.js.

        width={500}
        height={500}
        // Dimensions de rendu. Next.js génère plusieurs tailles pour optimiser le chargement.

        alt="Pain chaud sortie du four"
        // Texte alternatif pour l'accessibilité.

        className={styles.homeImage}
        // Style appliqué à l'image (centrée, responsive, etc.)

        priority
        // Force le chargement immédiat (utile car c'est l'image principale de la page).
      />

      <button onClick={handleGuest} className="quaternary-button">
        {/* Bouton menant à la version démo */}
        Démo
      </button>

      <button onClick={handleOwner} className="primary-button">
        {/* Bouton menant à l'espace propriétaire */}
        Connexion
      </button>
    </div>
  );
};

export default HomePage;
// Export du composant pour qu'il soit utilisé comme page d'accueil.
