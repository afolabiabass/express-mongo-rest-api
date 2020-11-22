const fs = require('fs');
const path = require('path');

const config = {};

fs.readdirSync(__dirname).forEach(function(file) {
  const name = file.slice(0, -3);
  if (name !== 'index') {
    config[name] = require(path.join(__dirname, name));
  }
});

module.exports = config
