const Application = require('./Application');

// Get root path and store as global
var path = require('path');
var root = path.resolve(__dirname);
global._root_ = root.substring(0, root.indexOf('/node_modules'));

global.app = new Application();

console.log(app);
