/** @package        @cubo-cms/framework
  * @version        0.0.2
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/.autoload
  * @description    Autoloader
  **/
const moduleName = 'framework';

// Define Cubo namespace
if(typeof(global.Cubo) == 'undefined') global.Cubo = {};

// Load assets
const assets = require('./lib');

console.log(assets);

// Other required modules
const path = require('path');

// Get root path and store as global
global._module_ = path.resolve(__dirname);
global._root_ = _module_.substring(0, _module_.indexOf('/node_modules') == -1 ? _module_.length : _module_.indexOf('/node_modules'));

let lib = { };

function loadObject(lib, asset, library, object) {
  try {
    lib[asset][object] = require('./lib/' + asset + '/' + library);
    return true;
  } catch(error) {
    log.error(error);
    return false;
  }
}

if(typeof(assets) === 'object') {
  for(const [asset, libraries] of Object.entries(assets)) {
    lib[asset] = { };
    if(typeof(libraries) === 'object') {
      for(const [library, objects] of Object.entries(libraries)) {
        switch(typeof(objects)) {
          case 'object':
            for(var object of objects)
              loadObject(lib, asset, library, object);
            break;
          case 'string':
            loadObject(lib, asset, library, objects);
        }
      }
    }
    module.exports = lib[asset];
    if(typeof(Cubo) == 'object') {
      Object.assign(Cubo, lib[asset]);
    }
  }
}
