/** @package        @cubo-cms/framework
  * @version        0.0.2
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/class/application
  * @description    Application framework
  **/

module.exports = class Application {

  // Initialise application
  // @param config: initialisation file; defaults to .init.json
  constructor(config = '.init.json') {
    this.init(config);
  }

  // Load application initialisation data
  // @param config: initialisation file
  // @return: application data
  init(config) {
    this.params = new Cubo.Params(config);
  }

  get(param) {
    return this.params.get(param);
  }

  set(param, value, defaultValue) {
    this.params.set(param, value, defaultValue);
  }

  invokeRouter(config) {
    return new Framework.Router(config);
  }

  run(request) {
    // Save request info
    this.set('request', request);
    // Invoke the router passing the router definitions
    this.router = this.invokeRouter(this.get('router'));
    // Parse the supplied request
    this.router.parse(request);
    // Invoke the controller
    if(this.controller = this.router.invokeController()) {
      // Magic
    } else {
      // Error
    }
  }
}
