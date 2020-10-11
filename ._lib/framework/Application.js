/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/application
  * @description    Application Framework
  **/
'use strict'

const http2 = require('http2');

/** @class          Application
  *
  * Main application class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Application extends Entity {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to file #/application.json
    **/
  constructor(data = '#/application') {
    super(data);
    // Initialise logging
    global._log_ = Entity.load(this.get('logging'));
    // Store this object as a global _app_
    global._app_ = this;
    Log.success({ 'message': `Initialised application`, 'class': this.class });
  }

  /** Method callRouter - Get a new router object
    *
    * Returns router object
    *
    * @param {string||object} data - data to be passed to router
    * @return {object}
    **/
  callRouter(data = {}) {
    try {
      let router = new Router(data);
      router.caller = this;
      Log.success({ 'message': `Called router`, 'class': this.class });
      return router;
    } catch(error) {
      Log.error({ 'message': `Failed to call router`, 'class': this.class });
      return false;
    }
  }
  /** Callback function process - Process a request
    *
    * Processes a request and returns response
    *
    * @param {object} request
    * @param {object} response
    **/
  process(request, response) {
    Log.debug({ 'message': `Processing request \"${request.url}\"`, 'class': this.class });
    let router;
    let controller;
    let output;
    //_app_.set('session', request.getHeader('Cookie'));
    _app_.httpMethod = request.method;
    // Invoke the router passing the router definitions
    if(router = _app_.callRouter(_app_.get('route', {}))) {
      // Parse the supplied request; only interested in the URL part
      router.parse(typeof(request) == 'object' ? request.url : request);
      // Invoke the controller method
      try {
        controller = router.callController(router.valueOf());
        output = '<pre>'+controller.invokeMethod()+'</pre>';
      } catch(error) {
        Log.error({ 'message': `Failed to invoke controller`, 'class': Application.name });
        output = '<h1>Error</h1>';
      }
    }
    // TODO: content-type can change depending on output
    response.setHeader('Content-Type', 'text/html');
    // TODO: provide cookie from session object
    response.setHeader('Set-Cookie', []);
    // TODO: provide response code and message
    response.statusCode = 200;
    //response.statusMessage = 'This worked!'; Seems not to be supported
    // Return output
    response.end(output);
  }
  /** Method run - Run the server
    *
    * Starts the server listening for requests
    *
    * @param {string||object} serverOptions - server options; must include cert/key pair
    * @return {object}
    **/
  run(serverOptions = null) {
    let options = Entity.load(serverOptions || this.get('server'));
    http2.createSecureServer({
      cert: Entity.loadFile(options.cert),
      key: Entity.loadFile(options.key)
    }, this.process).listen(options.port);
  }
}