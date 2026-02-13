"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./home.module.css";

const HomePage = () => {
  const router = useRouter();

  const handleProducts = () => router.push("/productsOwner");
  const handleHomePage = () => router.push("/");

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>MiamList</h1>

      <Image
        src="/bread.png"
        width={500}
        height={500}
        alt="Pain chaud sortie du four"
        className={styles.homeImage}
      />

      <button onClick={handleProducts} className="primary-button">
        Connexion
      </button>

      <button onClick={handleHomePage} className="quaternary-button" disabled>
        Démo
      </button>
    </div>
  );
};

export default HomePage;
