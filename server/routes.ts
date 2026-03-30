import { Router } from "express";
import db from "./db.js";
import { generateSensoryDescription } from "./ai.js";

const router = Router();

// Health Check
router.get("/health", (req, res) => res.json({ status: "ok" }));

// Authentication API (Evolved Schema)
router.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing identity data" });
  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name || "", email, password], function(err) {
    if (err) return res.status(400).json({ error: "Email already archived" });
    res.json({ id: this.lastID, name: name || "", email });
  });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user: any) => {
    if (err) return res.status(500).json({ error: "Database failure" });
    if (!user) return res.status(401).json({ error: "NoSuchCurator" });
    if (user.password !== password) return res.status(401).json({ error: "InvalidSecurityKey" });
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

router.put("/auth/profile", (req, res) => {
  const { email, oldPassword, newPassword, newName } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user: any) => {
      if (err || !user) return res.status(401).json({ error: "NoSuchCurator" });
      
      // Verification logic: Password is ONLY required if newPassword is provided OR for identity proofing (but making identity proof optional for name-only)
      if (newPassword && user.password !== oldPassword) return res.status(401).json({ error: "InvalidSecurityKey" });
      
      const finalPassword = newPassword || user.password;
      const finalName = newName || user.name;
      
      db.run("UPDATE users SET password = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [finalPassword, finalName, user.id], (err) => {
        if (err) return res.status(500).json({ error: "Archive update failure" });
        res.json({ success: true, name: finalName });
      });
    });
});

// Coffees API
router.get("/coffees", (req, res) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  db.all("SELECT * FROM coffees ORDER BY id DESC LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/coffees", (req, res) => {
  const { name, brand, origin, roast_level, price, notes, image_url, roast_date } = req.body;
  db.run(
    "INSERT INTO coffees (name, brand, origin, roast_level, price, notes, image_url, roast_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, brand, origin, roast_level, price, notes, image_url, roast_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, brand, origin, roast_level, price, notes, image_url, roast_date });
    }
  );
});

router.put("/coffees/:id", (req, res) => {
  const { id } = req.params;
  const { name, brand, origin, roast_level, price, notes, image_url, roast_date } = req.body;
  db.run(
    `UPDATE coffees 
     SET name = ?, brand = ?, origin = ?, roast_level = ?, price = ?, notes = ?, image_url = ?, roast_date = ? 
     WHERE id = ?`,
    [name, brand, origin, roast_level, price, notes, image_url, roast_date, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, brand, origin, roast_level, price, notes, image_url, roast_date });
    }
  );
});

router.delete("/coffees/:id", (req, res) => {
  db.run("DELETE FROM coffees WHERE id = ?", req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
});

// Analytics API
router.get("/analytics", (req, res) => {
  db.all("SELECT * FROM orders", (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ order_count: orders.length, orders });
  });
});

// Order Processing
router.post("/orders", (req, res) => {
  const { coffee_id, quantity, total_price } = req.body;
  db.run(
    "INSERT INTO orders (coffee_id, quantity, total_price) VALUES (?, ?, ?)",
    [coffee_id, quantity, total_price],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, coffee_id, quantity, total_price });
    }
  );
});

// AI Description API
router.post("/ai/describe", async (req, res) => {
  const { name, notes, origin, brand } = req.body;
  try {
    const data = await generateSensoryDescription(name, brand, origin, notes);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
