"use client";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [shoppingList, setShoppingList] = useState([]);

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

  const handleRemove = async (product_id) => {
    try {
      const response = await fetch("/api/shoppingList", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });
      if (response.ok) {
        setShoppingList((prev) => prev.filter((item) => item.product_id !== product_id));
      }
    } catch (error) {
      console.error("Error removing item from shopping list:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Votre liste de courses</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {shoppingList.map((item) => (
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
    </div>
  );
};

export default HomePage;
