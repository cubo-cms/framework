/** @package        @cubo-cms/framework
  * @version        0.0.6
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/controller
  * @description    Controller Framework
  **/

module.exports = class Controller {
  constructor(param = { }) {
    this.init(param);
  }

  // Load controller data
  // @param param: controller data
  // @return: parameters
  init(param) {
    return this.param = new Cubo.Param(param);
  }
}
