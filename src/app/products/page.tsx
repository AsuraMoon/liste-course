"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const handleRedirectToList = () => router.push("/");
  const handleRedirectToNew = () => router.push("/products/createNew");

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

  interface Product {
    id: number;
    name: string;
    position: boolean;
  }

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

  const productsHigh = products
    .filter((product) => product.position === true)
    .sort((a, b) => a.name.localeCompare(b.name));

  const productsLow = products
    .filter((product) => product.position === false)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Liste des produits</h1>
      </header>
      <section>
        <h2>Produits en Haut</h2>
        <div className="responsive-wrap">
          {productsHigh.map((item: Product) => (
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
          {productsLow.map((item: Product) => (
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
