PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  fullname TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT,
  unit_price REAL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  client TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS estimate_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER NOT NULL,
  item_id INTEGER,
  description TEXT,
  qty REAL DEFAULT 0,
  unit_price REAL DEFAULT 0,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
);

-- Seed categories
INSERT OR IGNORE INTO categories (id, name) VALUES (1,'Materials'), (2,'Labor'), (3,'Rental Tools');

-- Seed sample items (pier foundation template)
INSERT OR IGNORE INTO items (id, category_id, name, description, unit, unit_price) VALUES
(1001,1,'12in Sonotube Forms','Concrete form tubes for 12in piers','each',15.00),
(1002,1,'Concrete (cubic yard)','Ready-mix concrete per cubic yard','cy',160.00),
(1003,1,'#4 Rebar (per ft)','Reinforcement rebar, #4','ft',1.20),
(1004,1,'Gravel Base (per ton)','Compacted gravel base','ton',45.00),
(2001,2,'Excavation Labor','Labor to dig holes for piers','hr',45.00),
(2002,2,'Concrete Pour Labor','Labor for pouring concrete','hr',40.00),
(2003,2,'Rebar Install Labor','Labor to cut & install rebar','hr',38.00),
(3001,3,'Mini Excavator Rental','Daily rate for mini excavator','day',350.00),
(3002,3,'Auger Rental','Daily rate for auger','day',120.00),
(3003,3,'Concrete Mixer Rental','Daily rate for portable mixer','day',55.00);
