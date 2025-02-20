const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// GET likes info for a survey (e.g. totalLikes, hasLiked)
router.get("/:surveyId/likes", async (req, res) => {
  const { surveyId } = req.params;
  const { id: userId } = req.user;
  
  try {
    // total likes
    const totalRes = await pool.query(
      "SELECT COUNT(*)::int AS total_likes FROM Likes WHERE survey_id = $1",
      [surveyId]
    );
    const totalLikes = totalRes.rows[0].total_likes;
    
    // check if current user liked
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

// POST => user likes the survey
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
    // If rows is empty, means user already liked or conflict
    const liked = rows.length > 0;
    
    res.json({ success: true, liked });
  } catch (error) {
    console.error("Error liking survey:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE => user unlikes the survey
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
