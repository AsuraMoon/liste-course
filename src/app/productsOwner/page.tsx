"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./products.css";

interface Product {
  id: number;
  name: string;
  position: string;
}

const normalizePosition = (pos?: string | null) =>
  (pos || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await fetch("/api/keepAlive");
        const response = await fetch("/api/productsOwner");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
        console.log("Produits reçus :", data);
      } catch (error){
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filterBySearch = (list: Product[]) => {
    const ns = normalize(searchTerm || "");
    if (ns.length < 3) return list;
    return list.filter((p) => normalize(p.name).includes(ns));
  };

  const sortByName = (list: Product[]) =>
    list.sort((a, b) =>
      sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  // catégories voulues (order fixe)
  const isHaut = (p: Product) => normalizePosition(p.position) === "haut";
  const isBasSec = (p: Product) => normalizePosition(p.position) === "bas sec" || normalizePosition(p.position) === "basec" ? true : normalizePosition(p.position) === "bas sec";
  const isBasSurgele = (p: Product) =>
    normalizePosition(p.position) === "bas surgele" || normalizePosition(p.position) === "bas surgele";
  const isBasFrais = (p: Product) => normalizePosition(p.position) === "bas frais" || normalizePosition(p.position) === "bas frais";

  // groupes
  const allProducts = products || [];
  const hautGroup = sortByName(filterBySearch(allProducts.filter(isHaut)));
  const basSecGroup = sortByName(filterBySearch(allProducts.filter((p) => !isHaut(p) && normalizePosition(p.position) === "bas sec")));
  const basSurgeleGroup = sortByName(filterBySearch(allProducts.filter((p) => !isHaut(p) && normalizePosition(p.position) === "bas surgele")));
  const basFraisGroup = sortByName(filterBySearch(allProducts.filter((p) => !isHaut(p) && normalizePosition(p.position) === "bas frais")));

  const handleAddToShoppingList = async (product_id: number) => {
    try {
      const response = await fetch("/api/shoppingOwnerList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });
      if (response.ok) console.log("Produit ajouté à la liste de courses");
    } catch (error) {
      console.error("Error adding to shopping list:", error);
    }
  };

  const renderCard = (item: Product) => (
    <div key={item.id} className="responsive-card">
      <span className="card-title">{item.name}</span>
      <div className="card-actions">
        <button onClick={() => handleAddToShoppingList(item.id)} className="btn-primary">Ajouter à la liste</button>
        <button onClick={() => router.push(`/productsOwner/${item.id}`)} className="btn-secondary">Voir le produit</button>
      </div>
    </div>
  );

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Liste des produits</h1> 
        <button onClick={() => router.push("/productsOwner/list")} className="btn-tertiary">Aller à la liste de courses</button>
        <button onClick={() => router.push("/productsOwner/createNew")} className="btn-tertiary">Créer un nouveau produit</button>
        <div className="search-controls">
          <input type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
      </header>

      <section>
        <h2>Haut</h2>
        <div className="responsive-wrap">
          {hautGroup.map(renderCard)}
        </div>
      </section>

      <section>
        <h2>Bas Sec</h2>
        <div className="responsive-wrap">
          {basSecGroup.map(renderCard)}
        </div>
      </section>

      <section>
        <h2>Bas Surgelé</h2>
        <div className="responsive-wrap">
          {basSurgeleGroup.map(renderCard)}
        </div>
      </section>

      <section>
        <h2>Bas Frais</h2>
        <div className="responsive-wrap">
          {basFraisGroup.map(renderCard)}
        </div>
      </section>

      <footer className="action-buttons">
        <button onClick={() => router.push("/")} className="btn-tertiary">Aller à la liste de courses</button>
        <button onClick={() => router.push("/productsOwner/createNew")} className="btn-tertiary">Créer un nouveau produit</button>
      </footer>
    </div>
  );
}
