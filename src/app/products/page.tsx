"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const router = useRouter();

  interface Product {
    id: number;
    name: string;
    position: boolean;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToShoppingList = async (product_id: number) => {
    try {
      const response = await fetch("/api/shoppingList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });
      if (response.ok) {
        console.log("Produit ajouté à la liste de courses");
      }
    } catch (error) {
      console.error("Error adding to shopping list:", error);
    }
  };

  const filterAndSortProducts = (isHigh: boolean) => {
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const normalizedSearch = normalize(searchTerm);

  return products
    .filter((product) => product.position === isHigh)
    .filter((product) =>
      normalizedSearch.length < 3
        ? true
        : normalize(product.name).includes(normalizedSearch)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
};


  const productsHigh = filterAndSortProducts(true);
  const productsLow = filterAndSortProducts(false);

  const handleRedirectToList = () => router.push("/");
  const handleRedirectToNew = () => router.push("/products/createNew");

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Liste des produits</h1>

        <div className="search-controls">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
            className="sort-select"
          >
            <option value="asc">Tri A → Z</option>
            <option value="desc">Tri Z → A</option>
          </select>
        </div>
      </header>

      <section>
        <h2>Produits en Haut</h2>
        <div className="responsive-wrap">
          {productsHigh.map((item) => (
            <div key={item.id} className="responsive-card">
              <span className="card-title">{item.name}</span>
              <div className="card-actions">
                <button
                  onClick={() => handleAddToShoppingList(item.id)}
                  className="btn-primary"
                >
                  Ajouter à la liste
                </button>
                <button
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="btn-secondary"
                >
                  Voir le produit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Produits en Bas</h2>
        <div className="responsive-wrap">
          {productsLow.map((item) => (
            <div key={item.id} className="responsive-card">
              <span className="card-title">{item.name}</span>
              <div className="card-actions">
                <button
                  onClick={() => handleAddToShoppingList(item.id)}
                  className="btn-primary"
                >
                  Ajouter à la liste
                </button>
                <button
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="btn-secondary"
                >
                  Voir le produit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="action-buttons">
        <button onClick={handleRedirectToList} className="btn-tertiary">
          Aller à la liste de courses
        </button>
        <button onClick={handleRedirectToNew} className="btn-tertiary">
          Créer un nouveau produit
        </button>
      </footer>
    </div>
  );
};

export default ProductsPage;
