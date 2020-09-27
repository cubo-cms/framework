/** @package        @cubo-cms/framework
  * @version        0.0.2
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/.classloader
  * @description    Class loader
  **/
const moduleName = 'framework';

// Define Cubo namespace
if(typeof(global.Cubo) == 'undefined') global.Cubo = {};

// Load module classes and functions
const assets = require('./lib');

// Other required modules
const path = require('path');

// Get root path and store as global
global._module_ = path.resolve(__dirname);
global._root_ = _module_.substring(0, _module_.indexOf('/node_modules') == -1 ? _module_.length : _module_.indexOf('/node_modules'));
