/** @package        @cubo-cms/framework
  * @version        0.0.9
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/controller
  * @description    Controller Framework
  **/
'use strict'

// TODO: add standard methods

/** Prototype Function toProperCase
  *
  * Returns a string with the first letter capitalized
  *
  * @return {string}
  **/
String.prototype.toProperCase = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/** @class          Controller
  *
  * Main controller class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Controller extends Entity {
  /** Object method
    *
    * Contains all accepted methods
    **/
  method = { 'read': function(data) { return 'Read this, '+data.first; } }
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = { }) {
    super(data);
  }

  /** Getter controller
    *
    * Returns the name of the object for this controller
    *
    * @return {string}
    **/
  get controller() {
    return this.class.substring(0, this.class.length - super.class.length);
  }

  /** Static Method construct
    *
    * Create a new controller object with specified name
    *
    * @param {string} className
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {bool}
    **/
  static construct(className, data = {}, caller = null) {
    try {
      if(this.exists(className)) {
        let object = new __namespace[className + this.name](data);
        object.caller = caller;
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to construct controller \"${controllerName}\"`, 'class': this.name });
    }
  }

  /** Static Method exists
    *
    * Returns true if the specified controller exists
    *
    * @param {string} className
    * @return {bool}
    **/
  static exists(className = '') {
    if(typeof(__namespace) == 'object') {
      return typeof(__namespace[className + this.name]) == 'function';
    } else {
      return false;
    }
  }

  /** Method invokeMethod
    *
    * Invokes the controller method and returns processed data
    *
    * @return {object}
    **/
  invokeMethod() {
    let method = this.get('method');
    if(method) {
      if(typeof(this.method[method]) == 'function') {
        Log.success({ 'message': `Invoking method \"${method}\"`, 'class': this.class });
        return this.method[method](this.valueOf());
      } else {
        Log.warning({ 'message': `Failed to invoke method \"${method}\"`, 'class': this.class });
      }
    } else {
      Log.warning({ 'message': `No method specified`, 'class': this.class });
    }
  }
}
