const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const defaultJSON = require("../constants/constants").defaultJSON;
const newSurvey = require("../constants/constants").newSurvey;
const { canModifySurvey } = require("../uitls/canModifySurvey");

router.get("/", async (req, res) => {
  const { id: userId, is_admin } = req.user;
  try {
    let query, values;
    if (is_admin) {
      query = `
        SELECT s.*, u.name as user_name 
        FROM Surveys s
        JOIN Users u ON s.created_by = u.id
        ORDER BY s.created_at DESC
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } else {
      query = `
        SELECT s.*, u.name as user_name 
        FROM Surveys s
        JOIN Users u ON s.created_by = u.id
        WHERE s.access_settings = 'public' OR s.created_by = $1
        ORDER BY s.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      res.json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: req.t("surveys.serverError") });
  }
});

router.get("/my", async (req, res) => {
  const { id: userId } = req.user;
  try {
    const query = `
      SELECT s.*, u.name as user_name 
      FROM Surveys s
      JOIN Users u ON s.created_by = u.id
      WHERE s.created_by = $1 
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: req.t("surveys.serverError") });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let query, values;
    query = `
      SELECT s.*, u.name as user_name 
      FROM Surveys s
      JOIN Users u ON s.created_by = u.id
      WHERE s.id = $1
    `;
      values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: req.t('surveys.notFound') });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: req.t("surveys.serverError") });
  }
});

router.post("/", async (req, res) => {
  const { id: userId } = req.user;
  try {
    const surveyTemplate = JSON.parse(JSON.stringify(defaultJSON));

    surveyTemplate.name = newSurvey;
    surveyTemplate.json.title = newSurvey;
    
    const description = surveyTemplate.json.description || "";
    const tags = surveyTemplate.json.tags 
      ? Array.isArray(surveyTemplate.json.tags)
        ? surveyTemplate.json.tags.join(",")
        : surveyTemplate.json.tags
      : "";

    const insertQuery = `
      INSERT INTO Surveys (name, json, description, tags, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, json, description, tags, created_by, created_at
    `;
    const values = [
      surveyTemplate.name,
      JSON.stringify(surveyTemplate.json),
      description,
      tags,
      userId
    ];
    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: req.t("surveys.serverError") });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, json } = req.body;
  const hasPermission = await canModifySurvey(req, id);
  if (!hasPermission) {
    return res.status(403).json({ error: req.t('surveys.noCreator') });
  }

  try {
    let parsedJson;
    if (typeof json === "string") {
      parsedJson = JSON.parse(json);
    } else {
      parsedJson = json;
    }

    const description = parsedJson.description || "";
    const tags = parsedJson.tags 
      ? Array.isArray(parsedJson.tags)
        ? parsedJson.tags.join(",")
        : parsedJson.tags
      : "";

    const updatedName = name || parsedJson.title || null;

    const updateQuery = `
      UPDATE Surveys
      SET 
        name = COALESCE($1, name),
        json = COALESCE($2, json),
        description = $3,
        tags = $4
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await pool.query(updateQuery, [
      updatedName,
      JSON.stringify(parsedJson),
      description,
      tags,
      id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: req.t('surveys.notFound') });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: req.t('surveys.serverError') });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const hasPermission = await canModifySurvey(req, id);
  if (!hasPermission) {
    return res.status(403).json({ error: req.t('surveys.noCreator') });
  }

  try {
    const result = await pool.query(
      "DELETE FROM Surveys WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: req.t('surveys.notFound') });
    }
    res.json({ message: `Survey ${id} deleted`, deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: req.t('surveys.serverError') });
  }
});

router.post("/:id/results", async (req, res) => {
  const { id } = req.params;
  const { surveyResult } = req.body;
  const { id: userId } = req.user;

  if (!surveyResult) {
    return res.status(400).json({ error: req.t('surveys.missingResult') });
  }

  try {
    const check = await pool.query("SELECT id FROM Surveys WHERE id=$1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: req.t('surveys.notFound') });
    }

    const insertQuery = `
      INSERT INTO Results (survey_id, user_id, data)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [id, userId, surveyResult]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: req.t('surveys.serverError') });
  }
});

router.get("/:id/results", async (req, res) => {
  const { id } = req.params;
  const hasPermission = await canModifySurvey(req, id);

  try {
    if (hasPermission) {
      const query = `
        SELECT r.*, u.name as user_name 
        FROM Results r
        JOIN Users u ON r.user_id = u.id 
        WHERE r.survey_id = $1 
        ORDER BY r.id
      `;
      const { rows } = await pool.query(query, [id]);
      res.json(rows);
    } else {
      const countQuery = `SELECT COUNT(*) FROM Results WHERE survey_id = $1`;
      const { rows } = await pool.query(countQuery, [id]);
      res.json({ count: parseInt(rows[0].count, 10) });
    }
  } catch (error) {
    res.status(500).json({ error: req.t('surveys.serverError') });
  }
});

module.exports = router;
