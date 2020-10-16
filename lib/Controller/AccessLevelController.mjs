/** @package        @cubo-cms/framework
  * @version        0.0.15
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         AccessLevelController
  * @description    AccessLevelController class - controller for AccessLevel objects
  **/

import Controller from '../Core/Controller.mjs';

const methods = {
}

/** @module AccessLevelController
  *
  * AccessLevelController class - controller for AccessLevel objects
  **/
export default class AccessLevelController extends Controller {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.info(`Started ${this.class}`);
  }
}
