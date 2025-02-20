const express = require("express");
const router = express.Router();
const pool = require("../models/db");

router.get("/:surveyId/likes", async (req, res) => {
  const { surveyId } = req.params;
  const { id: userId } = req.user;
  
  try {
    const totalRes = await pool.query(
      "SELECT COUNT(*)::int AS total_likes FROM Likes WHERE survey_id = $1",
      [surveyId]
    );
    const totalLikes = totalRes.rows[0].total_likes;

    const userRes = await pool.query(
      "SELECT 1 FROM Likes WHERE survey_id = $1 AND user_id = $2",
      [surveyId, userId]
    );
    const hasLiked = userRes.rows.length > 0;
    
    res.json({ totalLikes, hasLiked });
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:surveyId/like", async (req, res) => {
  const { surveyId } = req.params;
  const { id: userId } = req.user;
  
  try {
    const sql = `
      INSERT INTO Likes (survey_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (survey_id, user_id) DO NOTHING
      RETURNING id
    `;
    const { rows } = await pool.query(sql, [surveyId, userId]);
    const liked = rows.length > 0;
    
    res.json({ success: true, liked });
  } catch (error) {
    console.error("Error liking survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:surveyId/like", async (req, res) => {
  const { surveyId } = req.params;
  const { id: userId } = req.user;
  
  try {
    await pool.query(
      "DELETE FROM Likes WHERE survey_id = $1 AND user_id = $2",
      [surveyId, userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error unliking survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
