/** @package        @cubo-cms/generic
  * @version        0.0.2
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib
  * @description    Autoloader Script
  **/
'use strict'

const fs = require('fs');
const path = require('path');

var index = new Set();

/** @function       getContents
  *
  * Recursively retrieves the contents of a folder
  *
  * @param {string} folder
  **/
const getContents = function(folder) {
  let list = fs. readdirSync(folder, { 'encoding': 'utf8', 'withFiletypes': true });
  for(const item of list) {
    let file = path.resolve(folder, item);
    if(fs.lstatSync(file).isDirectory()) {
      getContents(file);
    } else {
      if(path.extname(file) == '.js') {
        index.add(file.substring(0, path.basename(file) == 'index' ? file.length - 9 : file.length - 3));
      }
    }
  }
}

/** @function       loadModule
  *
  * Requires a module and stores the object both in the namespace and as a global
  **/
function loadModule(entity) {
  try {
    var obj = require(entity);
    if(typeof(obj) == 'function') {
      Cubo[obj.name] = global[obj.name] = obj;
    }
    obj = null;
  } catch(error) {
    console.log(error);
  }
}

// Define namespace and set global constants only when namespace is not defined
if(typeof(global.Cubo) == 'undefined') {
  // set namespace
  global.Cubo = {};
  // Get root path and store as global
  global._root_ = _module_.substring(0, _module_.indexOf('/node_modules') == -1 ? _module_.length : _module_.indexOf('/node_modules'));
}

// Set base folder to search recursively
const libFolder = path.join(__dirname, '..');
// Retrieve contents
getContents(libFolder);
// Load classes
for(const entity of index.keys()) {
  loadModule(entity);
}
