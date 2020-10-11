/** @package        @cubo-cms/controller
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         SchemaController
  * @description    SchemaController class - controller for Schema objects
  **/

import Controller from '../Core/Controller.mjs';

const methods = {
}

/** @module SchemaController
  *
  * SchemaController class - controller for Schema objects
  **/
export default class SchemaController extends Controller {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.success(`Started ${this.class}`);
  }
}
