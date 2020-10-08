/** @package        @cubo-cms/controller
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/controller/Schema
  * @description    Schema Controller
  **/
'use strict'

const methods = {
}

/** @class          SchemaController
  *
  * Controller for Schema objects
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class SchemaController extends Controller {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.debug('Started Schema Controller');
  }
}

module.exports = SchemaController;
