"use client";
import { useRouter } from "next/navigation";
import Image from "next/image"

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
      src="Bread.png"
      width={500}
      height={500}
      alt="Picture of the author"
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
