"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter(); 

  const handleRedirectToList = () => {
    router.push("/")
  }
  const handleRedirectToNew = () => {
    router.push("/products/createNew")
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Liste des produits</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Produits en Haut</h2>
        {productsHigh.map((item: Product) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            <span>{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToShoppingList(item.id)}
                className="text-blue-500"
              >
                Ajouter à la liste
              </button>
              <button
                onClick={() => router.push(`/products/${item.id}`)} // Redirige vers la page du produit
                className="text-green-500"
              >
                Voir le produit
              </button>
            </div>
          </div>
        ))}
        <h2 className="text-2xl font-bold mb-2 mt-6">Produits en Bas</h2>
        {productsLow.map((item: Product) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            <span>{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToShoppingList(item.id)}
                className="text-blue-500"
              >
                Ajouter à la liste
              </button>
              <button
                onClick={() => router.push(`/products/${item.id}`)} // Redirige vers la page du produit
                className="text-green-500"
              >
                Voir le produit
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleRedirectToList}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Aller à la liste de courses
      </button>
      <button
        onClick={handleRedirectToNew}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Créer un nouveau produit
      </button>
    </div>
  );
};

export default ProductsPage;