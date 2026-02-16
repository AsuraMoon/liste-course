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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // 🔥 Redirection forcée, quoi qu'il arrive
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await fetch("/api/keepAlive", { method: "POST" });
        const res = await fetch("/api/productsOwner");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        console.log("Produits reçus :", data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filterBySearch = (list: Product[]) => {
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q));
  };

  const sortByName = (list: Product[]) =>
    [...list].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );

  // position values must match exactly what comes from the API
  const isHaut = (p: Product) => p.position === "haut";
  const isBasSec = (p: Product) => p.position === "bas_sec";
  const isBasSurgele = (p: Product) => p.position === "bas_surgele";
  const isBasFrais = (p: Product) => p.position === "bas_frais";

  const all = products || [];
  const hautGroup = sortByName(filterBySearch(all.filter(isHaut)));
  const basSecGroup = sortByName(filterBySearch(all.filter(isBasSec)));
  const basSurgeleGroup = sortByName(filterBySearch(all.filter(isBasSurgele)));
  const basFraisGroup = sortByName(filterBySearch(all.filter(isBasFrais)));

  const handleAddToShoppingList = async (product_id: number) => {
    try {
      const res = await fetch("/api/productsOwner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });
      if (res.ok) console.log("Produit ajouté à la liste de courses");
    } catch (err) {
      console.error("Error adding to shopping list:", err);
    }
  };

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
          onClick={() => router.push(`/productsOwner/${item.id}`)}
          className="secondary-button"
        >
          Voir le produit
        </button>
      </div>
    </div>
  );

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Liste des produits</h1>
        <div className="action-buttons">
          <button
            onClick={() => router.push("/productsOwner/list")}
            className="tertiary-button"
          >
            Aller à la liste de courses
          </button>
          <button
            onClick={() => router.push("/productsOwner/createNew")}
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

      <section>
        <h2>Haut</h2>
        <div className="responsive-wrap">{hautGroup.map(renderCard)}</div>
      </section>

      <section>
        <h2>Bas Sec</h2>
        <div className="responsive-wrap">{basSecGroup.map(renderCard)}</div>
      </section>

      <section>
        <h2>Bas Surgelé</h2>
        <div className="responsive-wrap">{basSurgeleGroup.map(renderCard)}</div>
      </section>

      <section>
        <h2>Bas Frais</h2>
        <div className="responsive-wrap">{basFraisGroup.map(renderCard)}</div>
      </section>

      <div className="action-buttons">
        <button
          onClick={() => router.push("/productsOwner/list")}
          className="primary-button"
        >
          Aller à la liste de courses
        </button>
        <button
          onClick={() => router.push("/productsOwner/createNew")}
          className="secondary-button"
        >
          Créer un nouveau produit
        </button>
        <button onClick={handleLogout} className="quaternary-button">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
