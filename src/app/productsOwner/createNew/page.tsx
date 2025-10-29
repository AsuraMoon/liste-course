"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../app.css";
import "../products.css";


const CreateNewProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "haut",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/productsOwner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create product (${response.status}): ${text}`);
      }

      alert("Produit ajouté avec succès !");
      router.push("/productsOwner");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Une erreur est survenue lors de l'ajout du produit.");
    }
  };

  return (
    
    <div>
      <h1 className="search-controls">Ajouter un nouveau produit</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <div className="search-controls">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom du produit
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="search-controls">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="border p-2 w-full"
            >
              <option value="haut">Haut</option>
              <option value="bas_sec">Bas Sec</option>
              <option value="bas_surgele">Bas Surgelé</option>
              <option value="bas_frais">Bas Frais</option>
            </select>

            <p className="text-green-500 mt-2" id="successMessage" style={{ display: "none" }}>
              Produit ajouté avec succès !
            </p>
          </div>
          <div className="search-controls">
          <button
            type="submit"
            className="btn-primary"
          >
            Ajouter le produit
          </button>
          <button
            type="button"
            onClick={() => router.push("/productsOwner")}
            className="btn-tertiary"
          >
          Voir la liste des produits
          </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default CreateNewProductPage;
