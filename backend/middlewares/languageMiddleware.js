const { i18next } = require('../i18n');

const languageMiddleware = (req, res, next) => {
  const lang = req.headers['x-language']?.toLowerCase() || 'en';
  req.language = lang;
  i18next.changeLanguage(lang);
  req.t = (key) => i18next.t(key, { lng: lang });
  next();
};

module.exports = languageMiddleware;
