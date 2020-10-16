/** @package        @cubo-cms/framework
  * @version        0.0.14
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         AccessLevel
  * @description    AccessLevel class - model for AccessLevel objects
  **/

import Model from '../Core/Model.mjs';

const methods = {
}

/** @module AccessLevel
  *
  * AccessLevel class - model for AccessLevel objects
  **/
export default class AccessLevel extends Model {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(name, data = { }) {
    super(name, data);
    Object.assign(this.method, methods);
    Log.info(`Started ${this.class}`);
  }
}
