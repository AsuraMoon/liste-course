"use client";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

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

  const handleAddToShoppingList = async (product_id) => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Liste des produits</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {products.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <button
              onClick={() => handleAddToShoppingList(item.id)}
              className="text-blue-500"
            >
              Ajouter à la liste
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
