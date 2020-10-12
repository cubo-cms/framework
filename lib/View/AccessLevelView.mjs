/** @package        @cubo-cms/framework
  * @version        0.0.13
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         AccessLevelView
  * @description    AccessLevelView class - view for AccessLevel objects
  **/

import View from '../Core/View.mjs';

const methods = {
}

/** @module AccessLevelView
  *
  * AccessLevelView class - view for AccessLevel objects
  **/
export default class AccessLevelView extends View {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(name, data = { }) {
    super(name, data);
    Object.assign(this.method, methods);
    Log.success(`Started ${this.class}`);
  }
}
