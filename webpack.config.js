const path = require('path');

module.exports = {
  entry: './assets/js/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
  },
};
