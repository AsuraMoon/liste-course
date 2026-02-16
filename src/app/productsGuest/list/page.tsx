"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  position: string;
};

export default function ListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /* ------------------------------
     FETCH DE LA LISTE DE COURSES
  ------------------------------ */
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/shoppingGuestList");
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response shape");

        setProducts(data);
      } catch (err) {
        console.error("Error fetching shopping list:", err);
        setError("Impossible de charger la liste.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  /* ------------------------------
     MARQUER COMME ACHETÉ
  ------------------------------ */
  const markAsBought = async (id: number) => {
    try {
      const res = await fetch("/api/shoppingGuestList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: id }),
      });

      if (!res.ok) throw new Error(await res.text());

      // On retire le produit de la liste locale
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error marking product as bought:", err);
      alert("Erreur : impossible de marquer le produit comme acheté.");
    }
  };

  /* ------------------------------
     FILTRAGE PAR POSITION
  ------------------------------ */
  const filterByPosition = (pos: string) =>
    products
      .filter((p) => p.position === pos)
      .sort((a, b) => a.name.localeCompare(b.name));

  /* ------------------------------
     RENDU D'UNE SECTION
  ------------------------------ */
  const renderSection = (title: string, items: Product[]) => (
    <section key={title} className="section-block">
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p className="empty-text">Aucun produit</p>
      ) : (
        <div className="responsive-wrap">
          {items.map((p) => (
            <div key={p.id} className="responsive-card">
              <span className="card-title">{p.name}</span>

              <div className="card-actions">
                <button
                  onClick={() => markAsBought(p.id)}
                  className="primary-button"
                >
                  Acheté
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  /* ------------------------------
     ÉTATS : LOADING / ERREUR
  ------------------------------ */
  if (loading) return <div className="responsive-container">Chargement…</div>;

  if (error)
    return (
      <div className="responsive-container">
        <p className="error-text">{error}</p>
        <button onClick={() => router.refresh()} className="primary-button">
          Réessayer
        </button>
      </div>
    );

  /* ------------------------------
     CATÉGORIES DYNAMIQUES
  ------------------------------ */
  const categories = [
    { title: "Non Alimentaire", key: "haut" },
    { title: "Nourriture Sèche", key: "bas_sec" },
    { title: "Nourriture Surgelée", key: "bas_surgele" },
    { title: "Nourriture Frais", key: "bas_frais" },
  ];

  /* ------------------------------
     RENDU PRINCIPAL
  ------------------------------ */
  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Votre liste de courses</h1>

        <div className="action-buttons">
          <button
            onClick={() => router.push("/productsGuest")}
            className="tertiary-button"
          >
            Aller à la page des produits
          </button>
        </div>
      </header>

      {/* Rendu dynamique des sections */}
      {categories.map((cat) =>
        renderSection(cat.title, filterByPosition(cat.key)),
      )}

      {/* Boutons bas de page */}
      <div className="action-buttons">
        <button
          onClick={() => router.push("/productsGuest/createNew")}
          className="secondary-button"
        >
          Créer un nouveau produit
        </button>

        <button
          onClick={() => router.push("/productsGuest")}
          className="tertiary-button"
        >
          Aller à la page des produits
        </button>

        <button onClick={() => router.push("/")} className="quaternary-button">
          Accueil
        </button>
      </div>
    </div>
  );
}
