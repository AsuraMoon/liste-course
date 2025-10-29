"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./productsid.css";

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/productsOwner/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setUpdatedProduct({
          name: data.name,
          position: data.position
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/productsOwner/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error("Failed to update product");

      const data = await response.json();
      setProduct(data);
      alert("Produit mis à jour avec succès !");
      router.push("/productsOwner");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Échec de la mise à jour du produit.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/productsOwner/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      alert("Produit supprimé avec succès !");
      router.push("/productsOwner");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!product) return <div>Chargement...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Détails du produit</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <form onSubmit={handleUpdate} className="mb-4">
          <input
            type="text"
            value={updatedProduct.name}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, name: e.target.value })
            }
            placeholder="Nom du produit"
            className="border p-2 mb-2 w-full"
          />
          <label className="block mb-2">
            <span className="block font-semibold mb-1">Position</span>
            <select
              name="position"
              value={updatedProduct.position}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, position: e.target.value })
              }
              className="border p-2 w-full"
            >
              <option value="haut">Haut</option>
              <option value="bas_sec">Bas Sec</option>
              <option value="bas_surgele">Bas Surgelé</option>
              <option value="bas_frais">Bas Frais</option>
            </select>
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Mettre à jour
          </button>
        </form>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
