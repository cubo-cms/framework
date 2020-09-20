/** @package        cubo-cms/framework
  * @version        1.0.0
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         papiando
  * @description    Router Framework
  **/

module.exports = class Router {

  // Initialise router
  // @param routes: load defined routes for application
  constructor(routes) {
    this.init(routes);
  }

  // Load application defined routes
  // @param routes: defined routes
  // @return: application data
  init(routes) {
    this.params = new Framework.Params(routes);
  }
}
