
// Get root path and store as global
var path = require('path');
global._module_ = path.resolve(__dirname);
global._root_ = _module_.substring(0, _module_.indexOf('/node_modules') == -1? _module_.length : _module_.indexOf('/node_modules'));

// Get Framework classes
global.Framework = require('./lib');

// Run application
global.app = new Framework.Application();

//console.log(app);

//req = { "url": "https://papiando.com/user/papiando?format=json" };

//console.log(req.url);

//app.router.parse(req.url);

//console.log(app.router);

const server = require('http');

server.createServer(function(request, result) {
  result.writeHead(200, { "Content-Type": "text/html" });
  result.end(app.run(request));
}).listen(8080);
