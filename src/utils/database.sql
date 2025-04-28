-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- Nom du produit
    description TEXT,  -- Description du produit
    gluten BOOLEAN DEFAULT FALSE NOT NULL,  -- Contient-il du gluten ?
    lactose BOOLEAN DEFAULT FALSE NOT NULL,  -- Contient-il du lactose ?
    position BOOLEAN DEFAULT FALSE NOT NULL,  -- Position du produit : TRUE = Haut, FALSE = Bas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Date de création du produit
);


-- Table des éléments de la liste de courses
CREATE TABLE shopping_list_items (
    product_id INT REFERENCES products(id) ON DELETE CASCADE,  -- Référence au produit
    to_buy BOOLEAN DEFAULT FALSE,  -- Doit-on acheter ce produit ? TRUE = Oui, FALSE = Non
    PRIMARY KEY (product_id)  -- Chaque produit est unique dans la liste
);
