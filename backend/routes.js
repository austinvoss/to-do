const express = require("express");
const { Pool } = require("pg");

// Initialize router
const router = express.Router();

const pool = new Pool({
  user: "voss",
  host: "localhost",
  database: "voss", // <-- Update this line
  port: 5432,
});

router.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/todos", async (req, res) => {
  try {
    const { text } = req.body; // Extract text from the request body
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const result = await pool.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    // SQL query to update the 'completed' status of the todo item with the given 'id'
    const query = `UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *`;

    // Execute the query
    const { rows } = await pool.query(query, [completed, id]);

    // Check if the query affected any rows
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // SQL query to delete the todo item with the given 'id'
    const query = `DELETE FROM todos WHERE id = $1 RETURNING *`;

    // Execute the query
    const { rows } = await pool.query(query, [id]);

    // Check if the query affected any rows
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
