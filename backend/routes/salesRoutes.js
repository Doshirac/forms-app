const express = require("express");
const router = express.Router();
const jsforce = require("jsforce");
const pool = require("../models/db");

router.post('/create', async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      "SELECT email FROM Users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: req.t("sales.noUser") });
    }
    const userEmail = userResult.rows[0].email;

    const { firstName, lastName, companyName, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: req.t("sales.missNames")
      });
    }

    const conn = new jsforce.Connection({
      loginUrl: 'https://login.salesforce.com'
    });
    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
    );

    const account = await conn.sobject('Account').create({
      Name: `${firstName} ${lastName}`,
      Phone: phone || undefined,
      Description: companyName || ''
    });
    const accountId = account.id;

    const contact = await conn.sobject('Contact').create({
      FirstName: firstName,
      LastName: lastName,
      Email: userEmail,
      Phone: phone || undefined,
      AccountId: accountId
    });

    const accountLink = `${conn.instanceUrl}/lightning/r/Account/${accountId}/view`;

    return res.status(201).json({
      message: req.t("sales.success"),
      accountId,
      contactId: contact.id,
      accountLink
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: req.t("sales.error"),
      error: error.message 
    });
  }
});

module.exports = router;
