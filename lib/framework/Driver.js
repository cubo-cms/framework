/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/driver
  * @description    Driver Framework
  **/
'use strict'

// TODO: add standard methods

/** @class          Driver
  *
  * Main driver class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Driver extends Entity {
  /** Object method
    *
    * Contains all accepted methods
    **/
  method = {
    find: function(data) {
    }
  }
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
  }

  /** Static Method construct
    *
    * Create a new driver object with specified name
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {bool}
    **/
  static construct(name = '', data = {}, caller = null) {
    try {
      if(this.exists(name)) {
        let object = new __namespace[name + this.name](data);
        object.caller = caller;
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to construct driver \"${name}\"` });
    }
  }

  /** Static Method exists
    *
    * Returns true if the specified driver exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(name = '') {
    if(typeof(__namespace) == 'object') {
      return typeof(__namespace[name + this.name]) == 'function';
    } else {
      return false;
    }
  }
}
