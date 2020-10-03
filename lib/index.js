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
  let folders = [];
  let framework = '';
  // Add all files to index, parse folders later
  for(const item of list) {
    let file = path.resolve(folder, item);
    if(fs.lstatSync(file).isDirectory()) {
      if(item == 'framework')
        framework = file;
      else
        folders.push(file);
    } else {
      if(path.extname(file) == '.js') {
        index.add(file.substring(0, path.basename(file) == 'index' ? file.length - 9 : file.length - 3));
      }
    }
  }
  // Parse any framework folder first
  if(framework)
    getContents(framework);
  for(const folder of folders)
    getContents(folder);
}

/** @function       loadModule
  *
  * Requires a module and stores the object both in the namespace and as a global
  **/
function loadModule(entity) {
  try {
    var obj = require(entity);
    if(typeof(obj) == 'function') {
      __namespace[obj.name] = global[obj.name] = obj;
    }
    obj = null;
  } catch(error) {
    console.log(error);
  }
}

// Define namespace and set global constants only when namespace is not defined
const __modulePath = path.resolve(__dirname, '..');
if(typeof(global.__namespace) == 'undefined') {
  // Set namespace
  global.__namespace = {};
  // Get base path and store as global
  global.__base = __modulePath.substring(0, __modulePath.indexOf('/node_modules') == -1 ? __modulePath.length : __modulePath.indexOf('/node_modules'));
}

// Retrieve contents
getContents(path.join(__base, './lib'));

// Load modules in this order
for(const entity of index.keys()) {
  loadModule(entity);
}
