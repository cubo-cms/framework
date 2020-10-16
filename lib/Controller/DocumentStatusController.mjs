/** @package        @cubo-cms/controller
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         DocumentStatusController
  * @description    DocumentStatusController class - controller for DocumentStatus objects
  **/

import Controller from '../Core/Controller.mjs';

const methods = {
}

/** @module DocumentStatusController
  *
  * DocumentStatusController class - controller for DocumentStatus objects
  **/
export default class DocumentStatusController extends Controller {
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
