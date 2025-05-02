"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const router = useRouter();

  const handleRedirectToProducts = () => {
    router.push("/products");
  };

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await fetch("/api/shoppingList");
        const data = await response.json();
        setShoppingList(data);
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    };

    fetchShoppingList();
  }, []);

  interface ShoppingListItem {
    product_id: number;
    products: {
      name: string;
      position: boolean;
    };
  }

  const handleRemove = async (product_id: number): Promise<void> => {
    try {
      const response = await fetch("/api/shoppingList", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });
      if (response.ok) {
        setShoppingList((prev: ShoppingListItem[]) =>
          prev.filter((item) => item.product_id !== product_id)
        );
      }
    } catch (error) {
      console.error("Error removing item from shopping list:", error);
    }
  };

  // Séparer les produits en deux catégories : Haut et Bas
  const shoppingListHigh = shoppingList.filter(
    (item) => item.products?.position === true
  );
  const shoppingListLow = shoppingList.filter(
    (item) => item.products?.position === false
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Votre liste de courses</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Produits en Haut</h2>
        {shoppingListHigh.map((item) => (
          <div key={item.product_id} className="flex justify-between">
            <span>{item.products.name}</span>
            <button
              onClick={() => handleRemove(item.product_id)}
              className="text-red-500"
            >
              Retirer
            </button>
          </div>
        ))}
        <h2 className="text-2xl font-bold mb-2 mt-6">Produits en Bas</h2>
        {shoppingListLow.map((item) => (
          <div key={item.product_id} className="flex justify-between">
            <span>{item.products.name}</span>
            <button
              onClick={() => handleRemove(item.product_id)}
              className="text-red-500"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleRedirectToProducts}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Aller à la page des produits
      </button>
    </div>
  );  
};

export default HomePage;