const express = require("express");
const router = express.Router();
const pool = require("../models/db");

function buildNestedComments(flatComments) {
  const commentMap = {};
  flatComments.forEach((c) => {
    commentMap[c.comId] = { ...c, replies: [] };
  });

  const rootComments = [];
  flatComments.forEach((c) => {
    if (c.parentId) {
      commentMap[c.parentId].replies.push(commentMap[c.comId]);
    } else {
      rootComments.push(commentMap[c.comId]);
    }
  });

  return rootComments;
}

router.get("/:surveyId/comments", async (req, res) => {
  const { surveyId } = req.params;
  try {
    const sql = `
      SELECT c.id as "comId",
             c.text,
             c.created_at as "timestamp",
             COALESCE(c.parent_id, 0) as "parentId",
             u.id as "userId",
             u.name as "fullName"
      FROM Comments c
      JOIN Users u ON c.user_id = u.id
      WHERE c.survey_id = $1
      ORDER BY c.created_at ASC
    `;
    const { rows } = await pool.query(sql, [surveyId]);

    const flatComments = rows.map((r) => ({
      comId: String(r.comId),
      text: r.text,
      timestamp: r.timestamp,
      parentId: r.parentid ? String(r.parentid) : null,
      userId: String(r.userid),
      fullName: r.fullname,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.fullname)}`,
      replies: []
    }));

    const nested = buildNestedComments(flatComments);
    return res.json({ comments: nested });
  } catch (error) {
    console.error("Error getting nested comments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:surveyId/comments", async (req, res) => {
  const { surveyId } = req.params;
  const { id: userId, name: userName } = req.user;
  const { text, parentId } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const sql = `
      INSERT INTO Comments (survey_id, user_id, text, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id AS "comId", text, created_at AS "timestamp", parent_id
    `;
    const values = [surveyId, userId, text, parentId || null];
    const { rows } = await pool.query(sql, values);
    const inserted = rows[0];

    const newComment = {
      comId: String(inserted.comId),
      text: inserted.text,
      timestamp: inserted.timestamp,
      parentId: inserted.parent_id ? String(inserted.parent_id) : null,
      userId: String(userId),
      fullName: userName,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      replies: []
    };

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating new nested comment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
