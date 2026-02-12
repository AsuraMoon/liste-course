-- Produits pour les invités
CREATE TABLE products_guest (
  id          serial PRIMARY KEY,
  name        varchar NOT NULL UNIQUE,
  position    varchar NOT NULL DEFAULT 'haut'
              CHECK (position IN ('haut', 'bas_sec', 'bas_surgele', 'bas_frais')),
  created_at  timestamptz DEFAULT now()
);

-- Produits pour les propriétaires
CREATE TABLE products_owner (
  id          serial PRIMARY KEY,
  name        varchar NOT NULL UNIQUE,
  position    varchar NOT NULL DEFAULT 'haut'
              CHECK (position IN ('haut', 'bas_sec', 'bas_surgele', 'bas_frais')),
  created_at  timestamptz DEFAULT now()
);

-- Liste d’achats des invités
CREATE TABLE shopping_guest_list_items (
  product_id  int REFERENCES products_guest(id) ON DELETE CASCADE,
  to_buy      boolean DEFAULT false
);

-- Liste d’achats des propriétaires
CREATE TABLE shopping_owner_list_items (
  product_id  int UNIQUE REFERENCES products_owner(id) ON DELETE CASCADE,
  to_buy      boolean DEFAULT false
);

-- Heartbeat système (mise à jour)
CREATE TABLE system_heartbeat (
  id         serial PRIMARY KEY,
  last_ping  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Utilisateurs
CREATE TABLE users (
  id       serial PRIMARY KEY,
  email    varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  role     varchar NOT NULL CHECK (role IN ('owner', 'guest'))
);
