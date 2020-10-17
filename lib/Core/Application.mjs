/** @package        @cubo-cms/framework
  * @version        0.0.16
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
    this.session = {};
    // Store this object as a global _app_
    global._app_ = this;
    Log.success(`Application initialized`);
  }
  /** async @function router(data)
    *
    * Asynchronous function router - returns router object
    *
    * @param {string||object} data - data to be passed to router
    * @return {object}
    **/
  async router(data = {}) {
    try {
      let router = new Router(data);
      router.caller = this;
      Log.success(`Application invokes router`);
      return router;
    } catch(error) {
      throw new FrameworkError({ message: `Application failed to invoke router`, type: 'error' });
    }
  }
  /** @function run(serverOptions)
    *
    * Function run - Starts the server listening for requests
    *
    * @param {string||object} serverOptions - server options; must include cert/key pair
    **/
  run(serverOptions = null) {
    let options = Core.load(serverOptions || this.get('server'));
    let server = http2.createSecureServer({
      cert: Core.loadFile(options.cert),
      key: Core.loadFile(options.key)
    });
    server.on('error', (error) => {
      console.debug(error);
    });
    server.on('stream', (stream, headers) => {
      Log.info(`Application processes new request`);
      // Create or retrieve session
      let cookie = Cookie.unserialize(headers['cookie']);
      cookie.sessionId = cookie.sessionId || Session.generateKey();
      console.log(this.session);
      if(!this.session[cookie.sessionId])
        this.session[cookie.sessionId] = new Session(cookie);
      this.session[cookie.sessionId].set('timestamp', Date.now());
      // Invoke the router
      this.router(this.get('route')).then(async (router) => {
        router.set('method', headers[':method'].toLowerCase());
        router.set('path', headers[':path']);
        router.set('sessionId', cookie.sessionId);
        // Parse the request
        router.parse();
        // Invoke the controller
        return router.controller(router['@data']);
      }).then(async (controller) => {
        // Invoke controller method
        return await controller.invokeMethod();
      }).then((response) => {
        // Provide response
        stream.respond({
          'Content-Type': response.contentType || 'text/plain',
          'Set-Cookie': ['sessionId=' + cookie.sessionId +'; Secure'],
          ':status': response.result == 'success' ? 200 : 400
        });
        //stream.setHeader('Content-Type', response.contentType || 'text/plain');
        //stream.statusCode = response.result == 'success' ? 200 : 400;
        stream.end(response.output);
      }).catch((error) => {
        console.debug(error);
      }).finally(() => {
        Log.info(`Application finished processing request`);
      });
      //stream.end('<h1>No output</h1>');
    });
    server.listen(options.port);
    Log.success(`Application now listening to port \"${options.port}\"`);
  }
}
