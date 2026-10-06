const test = require('node:test');
const assert = require('node:assert/strict');
const loadSource = require('./loadSource.cjs');
let languageCode = 'vi';
const { messages, deviceLanguage } = loadSource('src/i18n.js', {
  react: { useEffect: () => {}, useState: () => {} },
  'react-native': { AppState: {} },
  'expo-localization': { getLocales: () => [{ languageCode }] },
});

test('Vietnamese and English contain all the same non-empty UI messages', () => {
  assert.deepEqual(Object.keys(messages.vi).sort(), Object.keys(messages.en).sort());
  for (const dictionary of Object.values(messages)) {
    for (const value of Object.values(dictionary)) assert.ok(typeof value === 'string' && value.length > 0);
  }
});

test('Select Vietnamese for a Vietnamese device and English otherwise', () => {
  languageCode = 'vi';
  assert.equal(deviceLanguage(), 'vi');
  languageCode = 'en';
  assert.equal(deviceLanguage(), 'en');
  languageCode = 'fr';
  assert.equal(deviceLanguage(), 'en');
});
