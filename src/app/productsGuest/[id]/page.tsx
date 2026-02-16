"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Params = Promise<{ id: string }>;

export default function ProductPage(props: { params: Params }) {
  const params = use(props.params);
  const { id } = params;

  interface Product {
    name: string;
    position: string;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    position: "haut",
  });

  const router = useRouter();

  /* ------------------------------
     FETCH DU PRODUIT
  ------------------------------ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/productsGuest/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();

        setProduct(data);
        setUpdatedProduct({
          name: data.name,
          position: data.position,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  /* ------------------------------
     MISE À JOUR DU PRODUIT
  ------------------------------ */
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/productsGuest/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error("Failed to update product");

      alert("Produit mis à jour avec succès !");
      router.push("/productsGuest");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Échec de la mise à jour du produit.");
    }
  };

  /* ------------------------------
     SUPPRESSION DU PRODUIT
  ------------------------------ */
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/productsGuest/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("Produit supprimé avec succès !");
      router.push("/productsGuest");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  /* ------------------------------
     ÉTAT : CHARGEMENT
  ------------------------------ */
  if (!product)
    return <div className="responsive-container">Chargement...</div>;

  /* ------------------------------
     RENDU PRINCIPAL
  ------------------------------ */
  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Détails du produit</h1>
      </header>

      {/* Carte centrée */}
      <div
        className="responsive-card"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h2 className="card-title">{product.name}</h2>

        <form onSubmit={handleUpdate}>
          {/* Nom */}
          <div className="search-controls">
            <label className="card-title" htmlFor="name">
              Nom du produit
            </label>

            <input
              id="name"
              type="text"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  name: e.target.value,
                })
              }
              className="search-input"
            />
          </div>

          {/* Position */}
          <div className="search-controls">
            <label className="card-title" htmlFor="position">
              Position
            </label>

            <select
              id="position"
              name="position"
              value={updatedProduct.position}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  position: e.target.value,
                })
              }
              className="search-input"
            >
              <option value="haut">Non Alimentaire</option>
              <option value="bas_sec">Nourriture Sèche</option>
              <option value="bas_surgele">Nourriture Surgelée</option>
              <option value="bas_frais">Nourriture Frais</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="action-buttons">
            <button type="submit" className="primary-button">
              Mettre à jour
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="quaternary-button"
            >
              Supprimer
            </button>

            <button
              type="button"
              onClick={() => router.push("/productsGuest")}
              className="tertiary-button"
            >
              Retour aux produits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
