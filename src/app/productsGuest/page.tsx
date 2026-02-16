"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  position: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await fetch("/api/keepAlive", { method: "POST" });

        const res = await fetch("/api/productsGuest");
        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  /* ------------------------------
     LOGIQUE DE TRI & RECHERCHE
  ------------------------------ */

  const filterBySearch = (list: Product[]) => {
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q));
  };

  const sortByName = (list: Product[]) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name));

  const filterByPosition = (pos: string) =>
    sortByName(filterBySearch(products.filter((p) => p.position === pos)));

  /* ------------------------------
     AJOUT À LA LISTE DE COURSES
  ------------------------------ */

  const handleAddToShoppingList = async (product_id: number) => {
    try {
      const res = await fetch("/api/productsGuest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });

      if (res.ok) console.log("Produit ajouté à la liste de courses");
    } catch (err) {
      console.error("Error adding to shopping list:", err);
    }
  };

  /* ------------------------------
     RENDU D'UNE CARTE PRODUIT
  ------------------------------ */

  const renderCard = (item: Product) => (
    <div key={item.id} className="responsive-card">
      <span className="card-title">{item.name}</span>

      <div className="card-actions">
        <button
          onClick={() => handleAddToShoppingList(item.id)}
          className="primary-button"
        >
          Ajouter à la liste
        </button>

        <button
          onClick={() => router.push(`/productsGuest/${item.id}`)}
          className="secondary-button"
        >
          Voir le produit
        </button>
      </div>
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

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Liste des produits</h1>

        <div className="action-buttons">
          <button
            onClick={() => router.push("/productsGuest/list")}
            className="tertiary-button"
          >
            Aller à la liste de courses
          </button>

          <button
            onClick={() => router.push("/productsGuest/createNew")}
            className="tertiary-button"
          >
            Créer un nouveau produit
          </button>
        </div>

        <div className="search-controls">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {/* Rendu dynamique des sections */}
      {categories.map((cat) => (
        <section key={cat.key}>
          <h2>{cat.title}</h2>
          <div className="responsive-wrap">
            {filterByPosition(cat.key).map(renderCard)}
          </div>
        </section>
      ))}

      <div className="action-buttons">
        <button
          onClick={() => router.push("/productsGuest/list")}
          className="primary-button"
        >
          Aller à la liste de courses
        </button>

        <button
          onClick={() => router.push("/productsGuest/createNew")}
          className="secondary-button"
        >
          Créer un nouveau produit
        </button>

        <button onClick={() => router.push("/")} className="quaternary-button">
          Accueil
        </button>
      </div>
    </div>
  );
}
