let Application = require('./lib/class/Application');

// Get root path and store as global
var path = require('path');
global._module_ = path.resolve(__dirname);
global._root_ = _module_.substring(0, _module_.indexOf('/node_modules'));

global.app = new Application();
