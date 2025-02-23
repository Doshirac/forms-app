const pool = require("../models/db");

const canModifySurvey = async (req, surveyId) => {
    const { id: userId, is_admin } = req.user;
    if (is_admin) return true;

    const creatorQuery = `SELECT created_by FROM Surveys WHERE id = $1`;
    const { rows } = await pool.query(creatorQuery, [surveyId]);
    if (rows.length === 0) {
        return false;
    }
    const surveyCreatorId = rows[0].created_by;
    return Number(surveyCreatorId) === Number(userId);
}

module.exports = {
    canModifySurvey,
};