"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateNewProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    gluten: false,
    lactose: false,
    position: false,
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      alert("Produit ajouté avec succès !");
      router.push("/products"); // Redirige vers la liste des produits
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Une erreur est survenue lors de l'ajout du produit.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Ajouter un nouveau produit</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gluten"
              checked={formData.gluten}
              onChange={handleInputChange}
              className="mr-2"
            />
            Contient du gluten
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="lactose"
              checked={formData.lactose}
              onChange={handleInputChange}
              className="mr-2"
            />
            Contient du lactose
          </label>
        </div>
        <div className="mb-4">
            <label className="flex items-center">
            <input
              type="checkbox"
              name="position"
              checked={formData.position}
              onChange={handleInputChange}
              className="mr-2"
            />
            Position : Haut (Bas par défaut)
            </label>
            <p className="text-green-500 mt-2" id="successMessage" style={{ display: "none" }}>
            Produit ajouté avec succès !
            </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Ajouter le produit
        </button>
      </form>
      <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
            Voir la liste des produits
            </button>
    </div>
  );
};

export default CreateNewProductPage;