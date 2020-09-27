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
    console.log(error);
    return false;
  }
}

function log(message) {
  if(typeof(LOGLEVEL) !== 'undefined') {
    switch(LOGLEVEL) {
      case 1:
        if(["error"].includes(message.type))
          console.log(message);
        break;
      case 2:
        if(["error", "warning"].includes(message.type))
          console.log(message);
        break;
      case 3:
        if(["error", "warning", "information"].includes(message.type))
          console.log(message);
        break;
      case 4:
        console.log(message);
    }
  }
}

if(typeof(assets) === 'object') {
  for(const [asset, libraries] of Object.entries(assets)) {
    lib[asset] = { };
    if(typeof(libraries) === 'object') {
      for(var [library, objects] of Object.entries(libraries)) {
        switch(typeof(objects)) {
          case 'object':
            for(var object of objects)
              if(loadObject(lib, asset, library, object))
                log({"type": "information", "module": moduleName, "description": `Successfully loaded ${asset} \"${library}\"`});
              else
                log({"type": "warning", "module": moduleName, "description": `Could not find ${asset} \"${library}\"`});
            break;
          case 'string':
            if(loadObject(lib, asset, library, objects))
              log({"type": "information", "module": moduleName, "description": `Successfully loaded ${asset} \"${library}\"`});
            else
              log({"type": "warning", "module": moduleName, "description": `Could not find ${asset} \"${library}\"`});
            break;
          default:
            log({ "type": "warning", "module": moduleName, "description": `Array expected` });
        }
      }
    } else
      log({ "type": "warning", "module": moduleName, "description": `Object expected` });
    module.exports = lib[asset];
    log({"type": "information", "module": moduleName, "description": `Successfully loaded asset \"${asset}\"`});
    if(typeof(Cubo) == 'object') {
      Object.assign(Cubo, lib[asset]);
      log({"type": "information", "module": moduleName, "description": `Successfully merged with global asset`});
    }
  }
} else
  log({ "type": "warning", "module": moduleName, "description": `Object expected` });
