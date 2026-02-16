"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    position: "haut",
  });

  const router = useRouter();

  /* ------------------------------
     GESTION DES INPUTS
  ------------------------------ */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------------------
     SUBMIT : CRÉATION DU PRODUIT
  ------------------------------ */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/productsGuest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to create product (${response.status}): ${text}`,
        );
      }

      alert("Produit ajouté avec succès !");
      router.push("/productsGuest");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Une erreur est survenue lors de l'ajout du produit.");
    }
  };

  /* ------------------------------
     RENDU PRINCIPAL
  ------------------------------ */
  return (
    <div className="responsive-container">
      <header className="responsive-header">
        <h1>Ajouter un nouveau produit</h1>
      </header>

      {/* Carte centrée */}
      <div
        className="responsive-card"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <div className="search-controls">
            <label htmlFor="name" className="card-title">
              Nom du produit
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="search-input"
            />
          </div>

          {/* Position */}
          <div className="search-controls">
            <label htmlFor="position" className="card-title">
              Position
            </label>

            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
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
              Ajouter le produit
            </button>

            <button
              type="button"
              onClick={() => router.push("/productsGuest")}
              className="tertiary-button"
            >
              Voir la liste des produits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
