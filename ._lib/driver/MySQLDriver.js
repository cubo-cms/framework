/** @package        @cubo-cms/driver
  * @version        0.0.1
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/driver/MySQLDriver
  * @description    MySQL Driver
  **/
'use strict'

const methods = {
}

/** @class          MySQLDriver
  *
  * Driver for MySQL queries
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class MySQLDriver extends Driver {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.debug('Started MySQL Driver');
  }

}

module.exports = MySQLDriver;
