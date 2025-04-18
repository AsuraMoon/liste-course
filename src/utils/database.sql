-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des allergies
CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Table pivot : utilisateurs et leurs allergies
CREATE TABLE user_allergies (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    allergy_id INT REFERENCES allergies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergy_id)
);

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    contains_allergens BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pivot : produits et allergènes
CREATE TABLE product_allergens (
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    allergy_id INT REFERENCES allergies(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, allergy_id)
);

-- Table des éléments de la liste de courses
CREATE TABLE shopping_list_items (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    PRIMARY KEY (user_id, product_id)
);
