const i18next = require("i18next");
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
  .use(Backend)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'de'],
    ns: ['translation'],
    defaultNS: 'translation',
    detection: {
      lookupHeader: 'X-Language',
      order: ['header']
    },
    interpolation: {
      escapeValue: false
    }
  });

module.exports = { i18next };
