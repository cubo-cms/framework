/** @package        @cubo-cms/framework
  * @version        0.0.12
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Model
  * @description    Model class - Retrieves data from driver and passes it back to controller
  **/

/** @module Model
  *
  * Model class - Retrieves data from driver and passes it back to controller
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Model extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    driver: 'JSON',
    method: 'get'
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    get: function(data) {
      try {
        let source;
        if(source = data.caller.source) {
          let driverName = source['driver'] || Model.default.driver;
          if(Driver.exists(driverName)) {
            Log.success(`Model calls driver \"${driverName}\"`);
            let driver = Driver.construct(driverName, data['@data'], data);
            return driver.invokeMethod('find');
          } else {
            Log.warning(`Model failed to call driver \"${driverName}\"`);
            return false;
          }
        } else {
          Log.warning(`Model could not determine driver`);
          return false;
        }
      } catch(error) {
        Log.error(`Model failed to call driver`);
        return false;
      }
    }
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
  /** @function model()
    *
    * Getter function model - returns the name of the object for this model
    *
    * @return {string}
    **/
  get model() {
    return this.class;
  }
  /** Static @function construct(name,data,caller)
    *
    * Static function construct - Creates a new model with specified name
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(name = '', data = {}, caller = null) {
    try {
      if(Model.exists(name)) {
        let object = new Namespace.namespace[name](data);
        object.caller = caller;
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error(`Model failed to construct \"${name}\"`);
    }
  }
  /** Static @function exists(name)
    *
    * Static function exists - Returns true if the specified model exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(name = '') {
    return Namespace.isLoaded(name);
  }
  /** @function invokeMethod(method)
    *
    * Function invokeMethod - Invokes model method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  invokeMethod(method = '') {
    if(method = method || Model.default.method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`Model invoking method \"${method}\"`);
        return this.method[method](this);
      } else {
        Log.warning(`Model failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Model could not determine method`);
    }
  }
}
