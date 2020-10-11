/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/Model
  * @description    Model Framework
  **/
'use strict'

// TODO: add standard methods

/** @class          Model
  *
  * Main model class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Model extends Entity {
  /** Object default
    *
    * Defines default values
    **/
  _default = {
    driver: 'JSON',
    method: 'get'
  }
  /** Object method
    *
    * Contains all accepted methods
    **/
  method = {
    get: function(data) {
      try {
        let source;
        if(source = data.caller.source) {
          let driverName = source['driver'] || data._default.driver;
          if(Driver.exists(driverName)) {
            Log.success({ 'message': `Calling driver \"${driverName}\"`, 'class': data.class });
            let driver = Driver.construct(driverName, data.valueOf(), data);
            return driver.invokeMethod('find');
          } else {
            Log.warning({ 'message': `Failed to call driver \"${driverName}\"`, 'class': data.class });
            return false;
          }
        } else {
          Log.warning({ 'message': `No driver supplied`, 'class': data.class });
          return false;
        }
      } catch(error) {
        Log.error({ 'message': `Failed to call driver`, 'class': data.class });
        return false;
      }
    }
  }
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super();
    this['@data'] = data;
  }
  /** Getter model
    *
    * Returns the name of the object for this model
    *
    * @return {string}
    **/
  get model() {
    return this.class;
  }
  /** Static Method construct
    *
    * Create a new model object with specified name
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {bool}
    **/
  static construct(name = '', data = {}, caller = null) {
    try {
      if(this.exists(name)) {
        let object = new __namespace[name](data);
        object.caller = caller;
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to construct model \"${name}\"` });
    }
  }
  /** Static Method exists
    *
    * Returns true if the specified model exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(name = '') {
    if(typeof(__namespace) == 'object') {
      return typeof(__namespace[name]) == 'function';
    } else {
      return false;
    }
  }
  /** Method invokeMethod
    *
    * Invokes the model method and returns processed data
    *
    * @return {object}
    **/
  invokeMethod(method = '') {
    method = method || this._default.method;
    if(method) {
      if(typeof(this.method[method]) == 'function') {
        Log.success({ 'message': `Invoking method \"${method}\"`, 'class': this.class });
        return this.method[method](this);
      } else {
        Log.warning({ 'message': `Failed to invoke method \"${method}\"`, 'class': this.class });
      }
    } else {
      Log.warning({ 'message': `No method specified`, 'class': this.class });
    }
  }
}