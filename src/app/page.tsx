"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./app.css";

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

  const shoppingListHigh = shoppingList.filter(
    (item) => item.products?.position === true
  );
  const shoppingListLow = shoppingList.filter(
    (item) => item.products?.position === false
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Votre liste de courses</h1>
      </div>
      <div>
        <h2>Produits en Haut</h2>
        {shoppingListHigh
          .sort((a, b) => a.products.name.localeCompare(b.products.name))
          .map((item) => (
            <div key={item.product_id} className="card">
              <span>{item.products.name}</span>
              <button onClick={() => handleRemove(item.product_id)}>
                Retirer
              </button>
            </div>
          ))}
        <h2>Produits en Bas</h2>
        {shoppingListLow.map((item) => (
          <div key={item.product_id} className="card">
            <span>{item.products.name}</span>
            <button onClick={() => handleRemove(item.product_id)}>
              Retirer
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleRedirectToProducts} className="button">
        Aller à la page des produits
      </button>
    </div>
  );
};

export default HomePage;
