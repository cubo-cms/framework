
// Get root path and store as global
var path = require('path');
global._module_ = path.resolve(__dirname);
global._root_ = _module_.substring(0, _module_.indexOf('/node_modules') == -1? _module_.length : _module_.indexOf('/node_modules'));

const framework = require('./lib');

global.app = new framework.Application();

console.log(app);
