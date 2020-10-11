/** @package        @cubo-cms/controller
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/controller/AccessLevel
  * @description    AccessLevel Controller
  **/
'use strict'

const methods = {
}

/** @class          AccessLevelController
  *
  * Controller for AccessLevel objects
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class AccessLevelController extends Controller {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.debug('Started AccessLevel Controller');
  }
}

module.exports = AccessLevelController;
