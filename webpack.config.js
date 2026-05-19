const path = require('path');

module.exports = {
  mode: 'development',   // or 'production' when ready
  entry: './examples/todo/src/app.js',  // your main JS file
  output: {
    filename: 'bundle.js',           // output file
    path: path.resolve(__dirname, 'dist'), // output folder
  },
  devtool: 'inline-source-map',      // helpful for debugging
};