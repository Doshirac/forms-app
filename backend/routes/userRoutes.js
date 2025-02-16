const express = require("express");
const pool = require("../models/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, status, last_login, is_admin FROM Users"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.fetchError')
    });
  }
});

router.post("/block", async (req, res) => {
  const { userIds } = req.body;
  try {
    await pool.query(
      "UPDATE Users SET status = 'blocked' WHERE id = ANY($1::int[])",
      [userIds]
    );
    res.status(200).json({ 
      message: req.t('users.blockSuccess')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.updateError')
    });
  }
});

router.post("/unblock", async (req, res) => {
  const { userIds } = req.body;
  try {
    await pool.query(
      "UPDATE Users SET status = 'active' WHERE id = ANY($1::int[])",
      [userIds]
    );
    res.status(200).json({ 
      message: req.t('users.unblockSuccess')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.updateError')
    });
  }
});

router.delete("/delete", async (req, res) => {
  const { userIds } = req.body;
  try {
    await pool.query("DELETE FROM Users WHERE id = ANY($1::int[])", [userIds]);
    res.status(200).json({ 
      message: req.t('users.deleteSuccess')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.deleteError')
    });
  }
});

router.post("/grant-admin", async (req, res) => {
  const { userIds } = req.body;
  const requestingUserId = req.user.id;

  try {
    const adminCheck = await pool.query(
      "SELECT is_admin FROM Users WHERE id = $1",
      [requestingUserId]
    );

    if (!adminCheck.rows[0].is_admin) {
      return res.status(403).json({ 
        message: req.t('users.unauthorized')
      });
    }

    await pool.query(
      "UPDATE Users SET is_admin = true WHERE id = ANY($1::int[])",
      [userIds]
    );
    res.status(200).json({ 
      message: req.t('users.grantAdminSuccess')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.updateError')
    });
  }
});

router.post("/revoke-admin", async (req, res) => {
  const { userIds } = req.body;
  const requestingUserId = req.user.id;

  try {
    const adminCheck = await pool.query(
      "SELECT is_admin FROM Users WHERE id = $1",
      [requestingUserId]
    );

    if (!adminCheck.rows[0].is_admin) {
      return res.status(403).json({ 
        message: req.t('users.unauthorized')
      });
    }

    await pool.query(
      "UPDATE Users SET is_admin = false WHERE id = ANY($1::int[])",
      [userIds]
    );
    res.status(200).json({ 
      message: req.t('users.revokeAdminSuccess')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: req.t('users.updateError')
    });
  }
});

module.exports = router;