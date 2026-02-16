/* ============================================================
   TABLES PRODUITS (GUEST + OWNER)
   ============================================================ */

CREATE TABLE products_guest (
  id          serial PRIMARY KEY,
  name        varchar NOT NULL UNIQUE,
  position    varchar NOT NULL DEFAULT 'haut'
              CHECK (position IN ('haut', 'bas_sec', 'bas_surgele', 'bas_frais')),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_products_guest_position
  ON products_guest(position);


CREATE TABLE products_owner (
  id          serial PRIMARY KEY,
  name        varchar NOT NULL UNIQUE,
  position    varchar NOT NULL DEFAULT 'haut'
              CHECK (position IN ('haut', 'bas_sec', 'bas_surgele', 'bas_frais')),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_products_owner_position
  ON products_owner(position);


/* ============================================================
   TABLES SHOPPING LIST (GUEST + OWNER)
   ============================================================ */

CREATE TABLE shopping_guest_list_items (
  id          serial PRIMARY KEY,
  product_id  int NOT NULL,
  to_buy      boolean DEFAULT false,

  CONSTRAINT shopping_guest_product_fk
    FOREIGN KEY (product_id)
    REFERENCES products_guest(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_shopping_guest_product_id
  ON shopping_guest_list_items(product_id);


CREATE TABLE shopping_owner_list_items (
  id          serial PRIMARY KEY,
  product_id  int NOT NULL UNIQUE,
  to_buy      boolean DEFAULT false,

  CONSTRAINT shopping_owner_product_fk
    FOREIGN KEY (product_id)
    REFERENCES products_owner(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_shopping_owner_product_id
  ON shopping_owner_list_items(product_id);


/* ============================================================
   TRIGGERS : AUTO‑INSERT DANS LES SHOPPING LISTS
   ============================================================ */

-- GUEST
CREATE OR REPLACE FUNCTION create_guest_list_item()
RETURNS trigger AS $$
BEGIN
  INSERT INTO shopping_guest_list_items (product_id, to_buy)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_guest_list_item
AFTER INSERT ON products_guest
FOR EACH ROW
EXECUTE FUNCTION create_guest_list_item();


-- OWNER
CREATE OR REPLACE FUNCTION create_owner_list_item()
RETURNS trigger AS $$
BEGIN
  INSERT INTO shopping_owner_list_items (product_id, to_buy)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_owner_list_item
AFTER INSERT ON products_owner
FOR EACH ROW
EXECUTE FUNCTION create_owner_list_item();


/* ============================================================
   FIX : AJOUTER LES PRODUITS EXISTANTS DANS LES SHOPPING LISTS
   ============================================================ */

-- GUEST
INSERT INTO shopping_guest_list_items (product_id, to_buy)
SELECT id, false
FROM products_guest
WHERE id NOT IN (
  SELECT product_id FROM shopping_guest_list_items
);

-- OWNER
INSERT INTO shopping_owner_list_items (product_id, to_buy)
SELECT id, false
FROM products_owner
WHERE id NOT IN (
  SELECT product_id FROM shopping_owner_list_items
);


/* ============================================================
   TABLES SYSTEME
   ============================================================ */

CREATE TABLE system_heartbeat (
  id         serial PRIMARY KEY,
  last_ping  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id       serial PRIMARY KEY,
  email    varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  role     varchar NOT NULL CHECK (role IN ('owner', 'guest'))
);
