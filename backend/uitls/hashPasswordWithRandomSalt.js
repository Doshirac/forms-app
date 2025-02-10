const bcrypt = require("bcrypt");

const hashPasswordWithRandomSalt = async (password, salt) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { hashPasswordWithRandomSalt };