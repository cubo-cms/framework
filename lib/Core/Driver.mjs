/** @package        @cubo-cms/framework
  * @version        0.0.12
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Driver
  * @description    Driver class - Retrieves data from datasource and passes it back to model
  **/

/** @module Driver
  *
  * Driver class - Retrieves data from datasource and passes it back to model
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Driver extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super();
    this['@data'] = data;
  }
  /** @function driver()
    *
    * Getter function driver - returns the name of the object for this driver
    *
    * @return {string}
    **/
  get driver() {
    return this.class.substring(0, this.class.length - super.class.length);
  }
  /** Static @function construct(name,data,caller)
    *
    * Static function construct - Creates a new driver with specified name
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(name = '', data = {}, caller = null) {
    try {
      if(Driver.exists(name)) {
        let object = new Namespace.namespace[name + this.name](data);
        object.caller = caller;
        // Also retrieve source information from controller
        object.source = caller.caller.source;
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error(`Driver failed to construct \"${name}\"`);
    }
  }
  /** Static @function exists(name)
    *
    * Static function exists - Returns true if the specified driver exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(name = '') {
    return Namespace.isLoaded(name + this.name);
  }
  /** @function invokeMethod(method)
    *
    * Function invokeMethod - Invokes driver method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  invokeMethod(method = '') {
    if(method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`Driver invoking method \"${method}\"`);
        return this.method[method](this);
      } else {
        Log.warning(`Driver failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Driver could not determine method`);
    }
  }
}
