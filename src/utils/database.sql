-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    allergies TEXT, -- Allergènes stockés comme une chaîne de texte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    allergens TEXT, -- Allergènes du produit comme une chaîne de texte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des éléments de la liste de courses
CREATE TABLE shopping_list_items (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    PRIMARY KEY (user_id, product_id)
);
