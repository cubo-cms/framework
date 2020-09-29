/** @package        @cubo-cms/framework
  * @version        0.0.6
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/application
  * @description    Application Framework
  **/
const moduleName = 'framework';

module.exports = class Application {
  // Initialise application
  // @param param: initialisation file; defaults to application.json
  constructor(param = 'application.json') {
    this.init(param);
    this.log.success({ 'module': moduleName, 'message': `Initialised application` });
  }

  // Load application data
  // @param param: application data
  // @return: parameters
  init(param) {
    this.param = new Cubo.Param(param);
    // Initialise logging
    this.log = new Cubo.Log(this.get('logging'));
  }

  // Shorthand to retrieve value of property
  // @param property: property of value to be retrieved
  // @return: retrieved value
  get(property) {
    return this.param.get(property);
  }

  // Shorthand to assign property a value; if none given use default value
  // @param property: property to be assigned to
  // @param value: value to be assigned
  // @param defaultValue: optional default value to be assigned
  set(property, value, defaultValue = null) {
    this.param.set(property, value, defaultValue);
  }

  // Invoke a new router
  // @param param: parameters to be passed to router
  // @return: router object; false on error
  invokeRouter(param) {
    try {
      const router = new Cubo.Router(param);
      return router;
    } catch(error) {
      this.log.error({ 'module': moduleName, 'message': `Failed to invoke Router` });
      return false;
    }
  }

  // Run the application to process a request
  // @param request: requested URL
  // TODO: Consider passing the action (POST, GET, DELETE) to controller
  run(request) {
    let router;
    let controller;
    // Invoke the router passing the router definitions
    if(router = this.invokeRouter(this.get('router'))) {
      // Parse the supplied request; only interested in the URL part
      router.parse(typeof(request) == 'object' ? request.url : request);
      // Invoke the controller
      try {
        controller = this.router.invokeController();
      } catch(error) {
        this.log.error({ 'module': moduleName, 'message': `Failed to invoke Controller` });
      }
    }
  }
}
