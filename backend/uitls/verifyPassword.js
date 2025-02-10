const bcrypt = require("bcrypt");

const verifyPassword = async (password, storedHash) => {
  const hashToCompare = await bcrypt.compare(password, storedHash);
  return hashToCompare;
};

module.exports = { verifyPassword };