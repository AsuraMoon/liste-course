import { createClient } from '@/utils/supabase/server';

export default async function UsersAndProducts() {
  const supabase = await createClient();

  // Récupérer les utilisateurs
  const { data: users, error: usersError } = await supabase.from("users").select();
  if (usersError || !users) {
    return <div>Error fetching users: {usersError?.message || "No users found"}</div>;
  }

  // Récupérer les produits
  const { data: products, error: productsError } = await supabase.from("products").select();
  if (productsError || !products) {
    return <div>Error fetching products: {productsError?.message || "No products found"}</div>;
  }

  // Afficher les utilisateurs et les produits
  return (
    <div>
      <h2>Users</h2>
      <pre>{JSON.stringify(users.map(user => user.username), null, 2)}</pre>

      <h2>Products</h2>
      <pre>{JSON.stringify(products.map(product => product.name), null, 2)}</pre>
    </div>
  );
}
