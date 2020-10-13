/** @package        @cubo-cms/framework
  * @version        0.0.13
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
    driver: 'JSON'
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    get: function(object) {
      let driver = object.callDriver(object['@data']);
      return driver.invokeMethod(object.get('method'));
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
  /** @function callDriver(data)
    *
    * Function callDriver - returns driver object
    *
    * @param {string||object} data - data to be passed to driver
    * @return {object}
    **/
  callDriver(data = {}) {
    try {
      let driver = this.get('driver', Model.default.driver);
      if(Driver.exists(driver)) {
        Log.success(`Model calls driver \"${driver}\"`);
        return Driver.construct(driver, data, this);
      } else {
        Log.warning(`Model failed to call driver \"${driver}\"`);
        return false;
      }
    } catch(error) {
      Log.error(`Model failed to call driver`);
      return false;
    }
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
        object.merge({'@data': data.source});
        object.set('driver', object.get('driver', Model.default.driver));
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
