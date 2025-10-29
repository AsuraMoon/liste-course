-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- Nom du produit
    description TEXT,  -- Description du produit
    position BOOLEAN DEFAULT FALSE NOT NULL,  -- Position du produit : TRUE = Haut, FALSE = Bas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Date de création du produit
);

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('owner', 'guest')) NOT NULL
);
