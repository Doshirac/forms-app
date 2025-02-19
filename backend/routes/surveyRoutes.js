const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const defaultJSON = require("../constants/constants").defaultJSON;
const { canModifySurvey } = require("../uitls/canModifySurvey");

router.get("/", async (req, res) => {
  const { id: userId, is_admin } = req.user;
  try {
    let query, values;
    if (is_admin) {
      query = `SELECT * FROM Surveys ORDER BY id`;
      values = [];
    } else {
      query = `SELECT * FROM Surveys WHERE created_by = $1 ORDER BY id`;
      values = [userId];
    }
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving surveys:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { id: userId, is_admin } = req.user;
  try {
    let result;
    if (is_admin) {
      result = await pool.query(`SELECT * FROM Surveys WHERE id = $1`, [id]);
    } else {
      result = await pool.query(
        `SELECT * FROM Surveys WHERE id = $1 AND created_by = $2`,
        [id, userId]
      );
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { id: userId } = req.user;

  try {
    const countRes = await pool.query("SELECT COUNT(*)::int as cnt FROM Surveys");
    const nextNum = countRes.rows[0].cnt + 1;
    const surveyTemplate = JSON.parse(JSON.stringify(defaultJSON));

    surveyTemplate.name = `New Survey ${nextNum}`;
    surveyTemplate.json.title = `New Survey ${nextNum}`;

    const insertQuery = `
      INSERT INTO Surveys (name, json, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, json, created_by, created_at
    `;
    const values = [
      surveyTemplate.name,
      JSON.stringify(surveyTemplate.json),
      userId
    ];
    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, json } = req.body
  const hasPermission = await canModifySurvey(req, id);
  if (!hasPermission) {
    return res.status(403).json({ error: "Forbidden: Not creator or admin" });
  }

  try {
    const updateQuery = `
      UPDATE Surveys
      SET 
        name = COALESCE($1, name),
        json = COALESCE($2, json)
      WHERE id = $3
      RETURNING *
    `;
    const { rows } = await pool.query(updateQuery, [
      name,
      typeof json === "string" ? json : JSON.stringify(json),
      id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const hasPermission = await canModifySurvey(req, id);
  if (!hasPermission) {
    return res.status(403).json({ error: "Forbidden: Not creator or admin" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM Surveys WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }
    res.json({ message: `Survey ${id} deleted`, deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/results", async (req, res) => {
  const { id } = req.params;
  const { surveyResult } = req.body;
  const { id: userId } = req.user;

  if (!surveyResult) {
    return res.status(400).json({ error: "Missing 'surveyResult'" });
  }

  try {
    const check = await pool.query("SELECT id FROM Surveys WHERE id=$1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const insertQuery = `
      INSERT INTO Results (survey_id, user_id, data)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [id, userId, surveyResult]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error posting survey results:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id/results", async (req, res) => {
  const { id } = req.params;
  const hasPermission = await canModifySurvey(req, id);
  if (!hasPermission) {
    return res.status(403).json({ error: "Forbidden: Not creator or admin" });
  }

  try {
    const query = "SELECT * FROM Results WHERE survey_id = $1 ORDER BY id";
    const { rows } = await pool.query(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
