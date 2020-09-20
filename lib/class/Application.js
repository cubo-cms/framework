/** @package        cubo-cms/framework
  * @version        1.0.0
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         papiando
  * @description    Application Framework
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
    this.params = new Framework.Params(config);
    this.router = new Framework.Router(this.get('router'));
  }

  get(param) {
    return this.params.get(param);
  }

  set(param, value, defaultValue) {
    this.params.set(param, value, defaultValue);
  }
}
