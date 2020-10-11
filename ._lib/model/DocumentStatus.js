/** @package        @cubo-cms/model
  * @version        0.0.1
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/model/DocumentStatus
  * @description    DocumentStatus Model
  **/
'use strict'

const methods = {
}

/** @class          DocumentStatus
  *
  * Model for DocumentStatus objects
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class DocumentStatus extends Model {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(name, data = { }) {
    super(name, data);
    Object.assign(this.method, methods);
    Log.debug('Started DocumentStatus Model');
  }
}

module.exports = DocumentStatus;