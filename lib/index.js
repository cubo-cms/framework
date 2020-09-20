const fs = require('fs');

const classes = {};

function fileList(folder) {
  fs.readdirSync(folder).forEach(function(file) {
    // Only do for all .js files except index.js
    if(file != 'index.js' && file.substr(file.lastIndexOf('.') + 1) == 'js') {
      const className = file.substr(0, file.indexOf('.'));
      classes[`${className}`] = require(folder + '/' + className);
      console.log(className);
    } else if(fs.lstatSync(folder + '/' + file).isDirectory()) {
      fileList(folder + '/' + file);
    }
  });
}

fileList(__dirname);

module.exports = classes;
