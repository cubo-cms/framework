const Application = require('./Application');

// Get root path and store as global
var path = require('path');
global._root_ = path.resolve(__dirname);

global.app = new Application();

console.log(app);
