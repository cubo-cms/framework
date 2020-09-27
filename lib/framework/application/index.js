/** @package        @cubo-cms/framework
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/application
  * @description    Application Framework
  **/
const moduleName = 'framework';

module.exports = class Application {

  // Initialise application
  // @param config: initialisation file; defaults to .init.json
  constructor(config = 'application.json') {
    this.init(config);
  }

  // Load application initialisation data
  // @param config: initialisation file
  // @return: application data
  init(config) {
    this.param = new Cubo.Param(config);
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
