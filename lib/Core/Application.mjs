/** @package        @cubo-cms/framework
  * @version        0.0.18
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Application
  * @description    Application class - Initialises and runs an application
  **/

import Server from './Server.mjs';
import Session from './Session.mjs';

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
    // Create session container and schedule cleanup
    this.session = {};
    Timer.onEvery(Session.default.cleanUpInterval, Session.cleanUp, this.session);
    // Store this object as a global _app_
    global._app_ = this;
    Log.success(`Application initialized`);
  }
  /** @function process(request)
    *
    * Function process - Processes the request and returns response
    *
    * @param {object} request - request object with url, headers, payload, method
    * @return {object} - response object
    **/
  process(request) {
    return new Promise((resolve, reject) => {
      let response = {};
      Log.info(`Application processes new request`);
      // Create or retrieve session
      let cookie = Cookie.unserialize(request.headers['cookie']);
      cookie.sessionId = cookie.sessionId || Session.generateKey();
      if(!_app_.session[cookie.sessionId])
        _app_.session[cookie.sessionId] = new Session(cookie);
      // Make sure sessions expire and get cleaned up
      Session.expire(_app_.session[cookie.sessionId]);
      // Invoke the router
      _app_.router(_app_.get('route')).then(async (router) => {
        router.set('method', request.method.toLowerCase());
        router.set('path', request.url);
        router.set('payload', request.payload);
        router.set('session', _app_.session[cookie.sessionId]);
        // Parse the request
        router.parse();
        // Invoke the controller
        return router.controller(router['@data']);
      }).then(async (controller) => {
        // Invoke controller method
        return await controller.invokeMethod();
      }).then((response) => {
        // Set cookies
        response.cookie = [ Cookie.serialize({ sessionId: response.sessionId || cookie.sessionId, Path: '/', Secure: true }) ];
        // Provide response
        resolve(response);
      }).catch((error) => {
        console.debug(error);
        reject('Error');
      }).finally(() => {
        Log.info(`Application finished processing request`);
      });
    });
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
  run(serverOptions = this['@data'].server) {
    this.start(serverOptions);
  }
  /** @function start(serverOptions)
    *
    * Function start - Starts the server listening for requests
    *
    * @param {string||object} serverOptions - server options; must include cert/key pair
    **/
  start(serverOptions = this['@data'].server) {
    serverOptions = Core.load(serverOptions || this.get('server'));
    let server = new Server(serverOptions);
  }
}
