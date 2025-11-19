const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db', 'estimator.db');
if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));
const db = new Database(DB_PATH);

// Run migration if needed
const t = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='items'").get();
if (!t) {
  const schema = fs.readFileSync(path.join(__dirname, 'migrations', 'schema.sql'), 'utf8');
  db.exec(schema);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple endpoints
app.get('/api/items', (req, res) => {
  const rows = db.prepare('SELECT i.*, c.name as category FROM items i LEFT JOIN categories c ON i.category_id = c.id').all();
  res.json(rows);
});

app.post('/api/items', (req,res)=>{
  const {category_id, name, description, unit, unit_price} = req.body;
  const stmt = db.prepare('INSERT INTO items (category_id, name, description, unit, unit_price) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(category_id, name, description, unit, unit_price);
  res.json({id: info.lastInsertRowid});
});

app.get('/api/estimates', (req,res)=> {
  const rows = db.prepare('SELECT * FROM estimates ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/estimates', (req,res)=> {
  const {name, client, notes, lines} = req.body;
  const info = db.prepare('INSERT INTO estimates (name, client, notes) VALUES (?, ?, ?)').run(name, client, notes);
  const estimate_id = info.lastInsertRowid;
  const insertLine = db.prepare('INSERT INTO estimate_lines (estimate_id, item_id, description, qty, unit_price) VALUES (?,?,?,?,?)');
  const insertMany = db.transaction((lines)=> {
    for(const l of lines){
      insertLine.run(estimate_id, l.item_id || null, l.description || '', l.qty || 0, l.unit_price || 0);
    }
  });
  insertMany(lines || []);
  res.json({id: estimate_id});
});

// Export estimate as simple JSON or generate XLSX (basic)
app.get('/api/estimates/:id/export', (req,res)=>{
  const id = req.params.id;
  const estimate = db.prepare('SELECT * FROM estimates WHERE id = ?').get(id);
  if(!estimate) return res.status(404).json({error:'Not found'});
  const lines = db.prepare('SELECT * FROM estimate_lines WHERE estimate_id = ?').all(id);
  res.json({estimate, lines});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend running on http://localhost:' + PORT));
