"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListPage = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const router = useRouter();

  interface ShoppingListItem {
    product_id: number;
    products_owner: {
      name: string;
      position: string;
    } | null;
  }

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await fetch("/api/shoppingOwnerList");
        const data = await response.json();
        setShoppingList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    };
    fetchShoppingList();
  }, []);

  const handleRemove = async (product_id: number) => {
    try {
      const response = await fetch("/api/shoppingOwnerList", {
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

  const filterByPosition = (position: string) =>
    shoppingList
      .filter((item) => item.products_owner?.position === position)
      .sort((a, b) => (a.products_owner!.name).localeCompare(b.products_owner!.name));

  const haut = filterByPosition("haut");
  const basSec = filterByPosition("bas_sec");
  const basSurgele = filterByPosition("bas_surgele");
  const basFrais = filterByPosition("bas_frais");

  const renderSection = (title: string, items: ShoppingListItem[]) => (
    <section key={title}>
      <h2>{title}</h2>
      <div className="responsive-wrap">
        {items.map((item) => (
          <div key={item.product_id} className="responsive-card">
            <span className="card-title">{item.products_owner?.name ?? "Sans nom"}</span>
            <div className="card-actions">
              <button className="btn-secondary" onClick={() => handleRemove(item.product_id)}>
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Votre liste de courses</h1>
        <button onClick={() => router.push("/productsOwner")} className="btn-primary">
          Aller à la page des produits
        </button>
      </header>

      {renderSection("Haut", haut)}
      {renderSection("Bas Sec", basSec)}
      {renderSection("Bas Surgelé", basSurgele)}
      {renderSection("Bas Frais", basFrais)}
    </div>
  );
};

export default ListPage;
