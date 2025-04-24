// app/shoppingList/page.tsx
"use client";  // Directive pour marquer ce fichier comme un composant client

import { useState, useEffect } from "react";


const ShoppingListPage = () => {
  interface ShoppingListItem {
    product_id: number;
    product_name: string;
    quantity: number;
  }
  
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  // Exemple de récupération des éléments de la liste de courses
  useEffect(() => {
    const fetchShoppingList = async () => {
      const userId = 1; // Remplace par l'ID de l'utilisateur connecté
      const res = await fetch(`/api/shoppingList/${userId}`);
      const data = await res.json();
      setShoppingList(data);
    };

    fetchShoppingList();
  }, []);

  const handleRemoveProduct = async (productId: number) => {
    const userId = 1; // Remplace par l'ID de l'utilisateur connecté

    const res = await fetch("/api/shoppingList", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId }),
    });
      setShoppingList(shoppingList.filter((item) => item.product_id !== productId));
    const data = await res.json();

    if (data.error) {
      alert(`Erreur: ${data.error}`);
    } else {
      setShoppingList(shoppingList.filter((item) => item.product_id !== productId));
    }
  };

  return (
    <div>
      <h1>Ma Liste de Courses</h1>
      <ul>
        {shoppingList.map((item) => (
          <li key={item.product_id}>
            {item.product_name} - {item.quantity}
            <button onClick={() => handleRemoveProduct(item.product_id)}>Retirer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListPage;
