const express = require("express");
const pool = require("../models/db")
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
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Enter valid email and password" });
    }

    const validPassword = await verifyPassword(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.rows[0].email !== email) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.rows[0].status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked." });
    }
    const token = generateToken(user.rows[0]);

    await pool.query("UPDATE Users SET last_login = NOW() WHERE id = $1", [
      user.rows[0].id,
    ]);

    res.status(200).json({ token, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;