const fs = require('node:fs');
const path = require('node:path');
const { withDangerousMod } = require('expo/config-plugins');

module.exports = function withLocalizedAppName(config) {
  return withDangerousMod(config, ['android', async (mod) => {
    const resources = path.join(mod.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
    for (const [locale, name] of [['vi', 'Quản lý sinh viên'], ['en', 'Student Manager']]) {
      const directory = path.join(resources, `values-${locale}`);
      await fs.promises.mkdir(directory, { recursive: true });
      await fs.promises.writeFile(path.join(directory, 'localized_app_name.xml'),
        `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <string name="app_name">${name}</string>\n</resources>\n`, 'utf8');
    }
    return mod;
  }]);
};
