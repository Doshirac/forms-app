const express = require("express");
const pool = require("../models/db");
const { i18next } = require("../i18n");
const {
    hashPasswordWithRandomSalt
  } = require("../uitls/hashPasswordWithRandomSalt");
const { verifyPassword } = require("../uitls/verifyPassword");
const {
  generateRandomSaltNumber,
} = require("../uitls/generateRandomSaltNumber");
const { generateToken } = require("../uitls/generateToken");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const saltRounds = generateRandomSaltNumber();

  try {
    const hashedPassword = await hashPasswordWithRandomSalt(
      password,
      saltRounds
    );
    const result = await pool.query(
      `INSERT INTO Users (email, password, salt, name, last_login, registration_time, status) 
       VALUES ($1, $2, $3, $4, NOW(), NOW(), 'active') RETURNING id, email, name`,
      [email, hashedPassword, saltRounds, name]
    );
    const newUser = result.rows[0];

    const token = generateToken(newUser);

    res.status(201).json({
      message: req.t('auth.registerSuccess'),
      token,
      user: newUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ 
        message: req.t('auth.emailExists')
      });
    }
    console.error("Error registering user:", error);
    res.status(500).json({ 
      message: req.t('auth.serverError')
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ 
        message: req.t('auth.invalidCredentials')
      });
    }

    const validPassword = await verifyPassword(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ 
        message: req.t('auth.invalidCredentials')
      });
    }

    if (user.rows[0].status === "blocked") {
      return res.status(403).json({ 
        message: req.t('auth.accountBlocked')
      });
    }

    const token = generateToken(user.rows[0]);

    await pool.query("UPDATE Users SET last_login = NOW() WHERE id = $1", [
      user.rows[0].id,
    ]);

    res.status(200).json({ 
      message: req.t('auth.loginSuccess'),
      token, 
      user: {
        is_admin: user.rows[0].is_admin || false
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: req.t('auth.serverError')
    });
  }
});

module.exports = router;