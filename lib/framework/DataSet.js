/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/driver
  * @description    DataSet Framework
  **/
'use strict'

// TODO: add standard methods

/** @class          DataSet
  *
  * Main driver class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class DataSet extends Entity {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = { }) {
    super(data);
  }
}
