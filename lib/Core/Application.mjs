/** @package        @cubo-cms/framework
  * @version        0.0.19
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
  /** @property {object} session - holds all initiated sessions
    **/
  #session = {};
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to file #/application.json
    **/
  constructor(data = '#/application.json') {
    super(data);
    Log.info({ message: `Application initialized`, class: this.name });
  }
  /** @function controller(data)
    *
    * Function controller - returns controller object
    *
    * @param {string||object} data - data to be passed to controller
    * @return {object}
    **/
  controller(data = {}) {
    if(data.dataType) {
      let dataType = data.dataType;
      Log.info({ message: `Application starts controller instance for \"${dataType}\"`, class: this.name });
      return Controller.construct(dataType, data, this);
    } else {
      throw new FrameworkError({ message: `Application could not determine controller instance name`, type: 'warning', class: this.name });
    }
  }
  /** @function process(request)
    *
    * Function process - Processes the request and returns response
    *
    * @param {object} request - request object with url, headers, payload, method
    * @return {object} - response object
    **/
  process(application, request) {
    return new Promise((resolve, reject) => {
      let response = {};
      Log.info({ message: `Application processes new request`, class: application.name });
      // Create or retrieve session
      let cookie = Cookie.unserialize(request.headers['cookie']);
      cookie.sessionId = cookie.sessionId || Session.generateKey();
      if(!application.#session[cookie.sessionId])
        application.#session[cookie.sessionId] = new Session(cookie);
      // Make sure sessions expire and get cleaned up
      application.#session[cookie.sessionId].expire();
      // Invoke the router
      application.router({ method: request.method.toLowerCase(), path: request.url, payload: request.payload, contentType: request.headers['content-type'] })
        .then(async (router) => {
          // Load route list
          router.route = Core.load(application.get('route'));
          // Parse the request
          router.parse();
          // Invoke the controller
          return application.controller(router.data);
        }).then(async (controller) => {
          controller.session = application.#session[cookie.sessionId];
          // Invoke controller method
          return await controller.invokeMethod();
        }).then((response) => {
          // Set cookie
          response.cookie = [ Cookie.serialize({ sessionId: response.sessionId || cookie.sessionId, Path: '/', Secure: true }) ];
          // Provide response
          resolve(response);
        }).catch((error) => {
          console.debug(error);
          reject('Error');
        }).finally(() => {
          Log.info({ message: `Application finished processing request`, class: application.name });
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
      Log.debug({ message: `Application invokes router`, class: this.name });
      return router;
    } catch(error) {
      throw new FrameworkError({ message: `Application failed to invoke router`, type: 'error', class: this.name });
    }
  }
  runUntil(code) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
      if(key === code) {
        process.exit();
      }
    });
  }
  /** @function start(serverOptions)
    *
    * Function start - Starts the server listening for requests
    *
    * @param {string||object} serverOptions - server options; must include cert/key pair
    **/
  start(serverOptions = this.get('server')) {
    // Start listening for ESC key to exit easily
    this.runUntil('\u001B');
    // Create session container and schedule cleanup
    this.#session = {};
    Timer.onEvery(Session.default.cleanUpInterval, Session.cleanUp, this.#session);
    // Start server process
    serverOptions = Core.load(serverOptions || this.get('server'));
    let server = new Server(serverOptions);
    server.start(this, this.process);
    Log.info({ message: `Press ESC to cancel`, class: this.name });
  }
}
