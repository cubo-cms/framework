/** @package        @cubo-cms/framework
  * @version        0.0.19
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
    super(data);
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
  /** async @function invokeMethod(method)
    *
    * Asynchronous function invokeMethod - Invokes driver method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  async invokeMethod() {
    let method = this.get('method');
    if(method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`Driver invokes method \"${method}\"`);
        return await this.method[method](this);
      } else {
        Log.warning(`Driver failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Driver could not determine method`);
    }
  }
  /** Static @function construct(driverType,data,caller)
    *
    * Static function construct - Creates a new driver with specified driverType
    *
    * @param {string} driverType
    * @param {string||object} data - to be passed on to new driver
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(driverType = '', data = {}, caller = null) {
    if(Driver.exists(driverType)) {
      try {
        let driver = new Namespace.loaded[driverType + this.name](data);
        driver.caller = caller;
        return driver;
      } catch(error) {
        throw new FrameworkError({ message: `Driver failed to construct \"${driverType}\"`, type: 'error' });
      }
    } else {
      throw new FrameworkError({ message: `Driver \"${driverType}\" does not exist`, type: 'error' });
    }
  }
  /** Static @function exists(driverType)
    *
    * Static function exists - Returns true if the specified driver exists
    *
    * @param {string} driverType
    * @return {bool}
    **/
  static exists(driverType = '') {
    return Namespace.isLoaded(driverType + this.name);
  }
}
