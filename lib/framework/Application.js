/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/application
  * @description    Application Framework
  **/
'use strict'

const http = require('http');

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
    * @param {string||object} data - defaults to file /application.json
    **/
  constructor(data = '~/application') {
    super(data);
    // Initialise logging
    this.log = Entity.load('logging');
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

  /** Method process - Process the requested URL
    *
    * Parses a requested URL and invoke the applicable controller method
    *
    * @param {string} request - URL to be processed
    * @return {object}
    **/
  // TODO: Consider passing the action (POST, GET, DELETE) to controller
  process(request) {
    let router;
    let controller;
    // Invoke the router passing the router definitions
    if(router = this.callRouter(this.get('router', {}))) {
      // Parse the supplied request; only interested in the URL part
      router.parse(typeof(request) == 'object' ? request.url : request);
      // Invoke the controller method
      try {
        controller = router.callController(router.valueOf());
        return '<pre>'+controller.invokeMethod()+'</pre>';
      } catch(error) {
        Log.error({ 'message': `Failed to invoke controller`, 'class': this.class });
      }
    }
  }

  /** Method run - Run the server
    *
    * Starts the server listening for requests
    *
    * @param {string||object} option - server configuration
    * @return {object}
    **/
  run(server = { 'port': 8080 }) {
    let app = this;
    http.createServer(function(request, result) {
      Log.debug({ 'message': `Processing request \"${request.url}\"`, 'class': this.class });
      let output = app.process(request);
      result.writeHead(200, { "Content-Type": "text/html" });
      result.end(output);
    }).listen(server.port || 8080);
  }
}
