const path = require("path");

// для jest чтобы не падали тесты на файлах с импортом картинок
module.exports = {
  process(src, filename, config, options) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
