"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../app.css";
import "../products.css"


type Product = {
  id: number;
  name: string;
  position: string;
};

export default function ListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/shoppingOwnerList");
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response shape");

        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching shopping list:", err);
        setError("Impossible de charger la liste.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const markAsBought = async (id: number) => {
    try {
      const res = await fetch("/api/shoppingOwnerList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id:id }),
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error marking product as bought:", err);
      alert("Erreur : impossible de marquer le produit comme acheté.");
    }
  };

  const filterByPosition = (pos: string) =>
    products
      .filter((p) => p.position === pos)
      .sort((a, b) => a.name.localeCompare(b.name));

  const renderSection = (title: string, items: Product[]) => (
    <section key={title} className="mb-5">
      <h2 className="mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-muted">Aucun produit</p>
      ) : (
        <div className="responsive-wrap">
  {items.map((p) => (
    <div key={p.id}>
      <div className="responsive-card">
        <span className="card-title">{p.name}</span>
        <div className="card-actions">
          <button
            onClick={() => markAsBought(p.id)}
            className="btn-primary w-100"
          >
            Acheté
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      )}
    </section>
  );

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error)
    return (
      <div className="p-4">
        <p className="text-danger">{error}</p>
        <button onClick={() => router.refresh()} className="btn-primary mt-3">
          Réessayer
        </button>
      </div>
    );

  const categories = [
    { title: "Haut", key: "haut" },
    { title: "Bas Sec", key: "bas_sec" },
    { title: "Bas Surgelé", key: "bas_surgele" },
    { title: "Bas Frais", key: "bas_frais" },
  ];

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1>Votre liste de courses</h1>
        <button
          onClick={() => router.push("/productsOwner")}
          className="btn-tertiary mt-2"
        >
          Aller à la page des produits
        </button>
      </header>

      {categories.map((cat) =>
        renderSection(cat.title, filterByPosition(cat.key))
      )}
    </div>
  );
}
