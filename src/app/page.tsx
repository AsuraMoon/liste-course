"use client";
import { useRouter } from "next/navigation";
import Image from "next/image"
import { Style } from "main";

const HomePage = () => {
  const router = useRouter();

  const handleProducts = () => {
    router.push("/productsOwner");
  };

  const handleHomePage = () => {
    router.push("/");
  };

  return (
    <div className="home-container">
      <h1>MiamList
      </h1>
      <Image
      src="/bread.png"
      width={500}
      height={500}
      alt="Pain chaud sortie du four"
      />

      <button onClick={handleProducts} className="navigate-button">
        Connexion
      </button>
      <button onClick={handleHomePage} className="navigate-button" disabled>
        Démo
      </button>
    </div>
  );
}

export default HomePage;
