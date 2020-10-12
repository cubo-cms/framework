/** @package        @cubo-cms/framework
  * @version        0.0.13
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Application
  * @description    Application class - Initialises and runs an application
  **/

import http2 from 'http2';

/** @module Application
  *
  * Application class - Initialises and runs an application
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Application extends Core {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to file #/application.json
    **/
  constructor(data = '#/application.json') {
    super(data);
    // Initialize logging
    global._log_ = Core.load(this.get('logging'));
    // Store this object as a global _app_
    global._app_ = this;
    Log.success(`Application initialized`);
  }
  /** @function callRouter(data)
    *
    * Function callRouter - returns router object
    *
    * @param {string||object} data - data to be passed to router
    * @return {object}
    **/
  callRouter(data = {}) {
    try {
      let router = new Router(data);
      router.caller = this;
      Log.success(`Application called router`);
      return router;
    } catch(error) {
      Log.error(`Application failed to call router`);
      return false;
    }
  }
  /** Callback @function process(request,response)
    *
    * Function process - processes a request and generates response
    *
    * @param {object} request
    * @param {object} response
    **/
  process(request, response) {
    Log.success(`Application now processing request \"${request.url}\"`);
    let router;
    let controller;
    let output;
    //_app_.set('session', request.getHeader('Cookie'));
    _app_.httpMethod = request.method;
    // Invoke the router passing the router definitions
    if(router = _app_.callRouter(_app_.get('route'))) {
      // Parse the supplied request; only interested in the URL part
      router.parse(typeof(request) == 'object' ? request.url : request);
      // Invoke the controller method
      try {
        if(router['@data'].controller) {
          controller = router.callController(router['@data']);
          let result = controller.invokeMethod();
          // TODO: content-type can change depending on output
          response.setHeader('Content-Type', result.contentType || 'text/plain');
          // TODO: provide cookie from session object
          response.setHeader('Set-Cookie', []);
          response.statusCode = result.result == 'success' ? 200 : 400;
          Log.success(`Application now sending response`);
          response.end(result.output);
        } else {
          // TODO: Need to locate file; for now, just return a 404 Not found
          response.statusCode = 404;
          response.end();
        }
      } catch(error) {
        Log.error(`Application failed to invoke controller`);
        response.statusCode = 400;
        response.end(output);
      }
    }
    // Return output
    response.end(output);
  }
  /** @function run(serverOptions)
    *
    * Function run - Starts the server listening for requests
    *
    * @param {string||object} serverOptions - server options; must include cert/key pair
    **/
  run(serverOptions = null) {
    let options = Core.load(serverOptions || this.get('server'));
    Log.success(`Application now listening to port \"${options.port}\"`);
    http2.createSecureServer({
      cert: Core.loadFile(options.cert),
      key: Core.loadFile(options.key)
    }, this.process).listen(options.port);
  }
}
