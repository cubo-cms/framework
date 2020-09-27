/** @package        @cubo-cms/framework
  * @version        0.0.4
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
  }

  // Load application initialisation data
  // @param param: initialisation file
  // @return: application data
  init(param) {
    this.param = new Cubo.Param(param);
    // Initialise logging
    this.log = new Cubo.Log(this.get('logging'));
  }

  get(property) {
    return this.param.get(property);
  }

  set(property, value, defaultValue = null) {
    this.param.set(property, value, defaultValue);
  }

  invokeRouter(config) {
    return new Cubo.Router(config);
  }

  run(request) {
    // Invoke the router passing the router definitions
    this.router = this.invokeRouter(this.get('router'));
    // Parse the supplied request
    this.router.parse(this.request = request);
    // Invoke the controller
    if(this.controller = this.router.invokeController()) {
      // Magic
    } else {
      // Error
    }
  }
}
