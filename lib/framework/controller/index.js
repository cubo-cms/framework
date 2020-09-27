/** @package        @cubo-cms/framework
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/controller
  * @description    Controller Framework
  **/

module.exports = class Controller {
  controller = '';

  constructor() {
    console.log(`Starting controller \"${this.controller}\"`);
  }
}
