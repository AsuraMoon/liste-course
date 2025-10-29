"use client";
import { useRouter } from "next/navigation";

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
      <h1>Bonjour, Bienvenue sur MiamList.Si vous êtes visiteur sélectionnez Démo le mail et le code de démonstration vous attendrons, sachez que vous aurez une version restreinte de lapplication,
      Sinon selectionner famille
      </h1>
      <button onClick={handleProducts} className="navigate-button">
        Connexion Famille
      </button>
      <button onClick={handleHomePage} className="navigate-button">
        Connexion Démo
      </button>
    </div>
  );
}

export default HomePage;
