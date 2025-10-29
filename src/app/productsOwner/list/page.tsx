"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../app.css";

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

        const res = await fetch("/api/shoppingOwnerList", { cache: "no-store" });
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
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Mise à jour locale : on retire l’élément de la liste
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
    <section key={title}>
      <h2>{title}</h2>
      <div className="responsive-wrap">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun produit</p>
        ) : (
          items.map((p) => (
            <div key={p.id} className="responsive-card">
              <span className="card-title">{p.name}</span>
              <div className="card-actions">
                <button
                  onClick={() => markAsBought(p.id)}
                  className="btn-primary"
                >
                  Acheté
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  if (loading) return <div className="p-6">Chargement…</div>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={() => router.refresh()} className="mt-4 btn-primary">
          Réessayer
        </button>
      </div>
    );

  const haut = filterByPosition("haut");
  const basSec = filterByPosition("bas_sec");
  const basSurgele = filterByPosition("bas_surgele");
  const basFrais = filterByPosition("bas_frais");

  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Votre liste de courses</h1>
        <button
          onClick={() => router.push("/productsOwner")}
          className="btn-tertiary"
        >
          Aller à la page des produits
        </button>
      </header>

      {renderSection("Haut", haut)}
      {renderSection("Bas Sec", basSec)}
      {renderSection("Bas Surgelé", basSurgele)}
      {renderSection("Bas Frais", basFrais)}
    </div>
  );
}
