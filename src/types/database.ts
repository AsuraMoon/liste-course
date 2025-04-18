export type Database = {
  users: {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
  };
  allergies: {
    id: number;
    name: string;
  };
  user_allergies: {
    user_id: number;
    allergy_id: number;
  };
  products: {
    id: number;
    name: string;
    description: string | null;
    contains_allergens: boolean;
    created_at: string;
  };
  product_allergens: {
    product_id: number;
    allergy_id: number;
  };
  shopping_list_items: {
    user_id: number;
    product_id: number;
    quantity: number;
  };
};
