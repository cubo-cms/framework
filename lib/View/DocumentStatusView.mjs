/** @package        @cubo-cms/framework
  * @version        0.0.15
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         DocumentStatusView
  * @description    DocumentStatusView class - view for DocumentStatus objects
  **/

import View from '../Core/View.mjs';

const methods = {
}

/** @module DocumentStatusView
  *
  * DocumentStatusView class - view for DocumentStatus objects
  **/
export default class DocumentStatusView extends View {
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
