"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const handleRedirectToList = () => {
    router.push("/");
  };
  const handleRedirectToNew = () => {
    router.push("/products/createNew");
  };

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

  const handleAddToShoppingList = async (product_id: number): Promise<void> => {
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

  const productsHigh = products.filter((product) => product.position === true);
  const productsLow = products.filter((product) => product.position === false);

  return (
    <div className="container">
      <div className="header">
        <h1>Liste des produits</h1>
      </div>
      <div>
        <h2>Produits en Haut</h2>
        {productsHigh.map((item: Product) => (
          <div key={item.id} className="card">
            <span>{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToShoppingList(item.id)}
                className="text-blue-500"
              >
                Ajouter à la liste
              </button>
              <button
                onClick={() => router.push(`/products/${item.id}`)}
                className="text-green-500"
              >
                Voir le produit
              </button>
            </div>
          </div>
        ))}
        <h2>Produits en Bas</h2>
        {productsLow.map((item: Product) => (
          <div key={item.id} className="card">
            <span>{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToShoppingList(item.id)}
                className="text-blue-500"
              >
                Ajouter à la liste
              </button>
              <button
                onClick={() => router.push(`/products/${item.id}`)}
                className="text-green-500"
              >
                Voir le produit
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="action-buttons">
        <button onClick={handleRedirectToList} className="bg-blue-500">
          Aller à la liste de courses
        </button>
        <button onClick={handleRedirectToNew} className="bg-green-500">
          Créer un nouveau produit
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
