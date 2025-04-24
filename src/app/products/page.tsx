// app/products/page.tsx
"use client";  // Directive pour indiquer que ce fichier est un composant client

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("famille"); // "famille" ou "demo"
  const router = useRouter();

  useEffect(() => {
    // Simuler la récupération du rôle utilisateur et des produits
    const userId = 1; // ID de l'utilisateur connecté
    const role = userId === 1 ? "famille" : "demo";
    setUserRole(role);

    // Récupérer les produits depuis l'API
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddProductToList = async (productId) => {
    if (userRole !== "famille") {
      alert("Seuls les utilisateurs famille peuvent ajouter des produits.");
      return;
    }

    const userId = 1; // Remplacer par l'ID de l'utilisateur connecté

    const res = await fetch("/api/shoppingList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId }),
    });

    const data = await res.json();

    if (data.error) {
      alert(`Erreur: ${data.error}`);
    } else {
      alert("Produit ajouté à la liste !");
    }
  };

  return (
    <div>
      <h1>Liste des Produits</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.contains_allergens ? "Contient des allergènes" : "Sans allergènes"}
            {userRole === "famille" && (
              <button onClick={() => handleAddProductToList(product.id)}>Ajouter à la liste</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
