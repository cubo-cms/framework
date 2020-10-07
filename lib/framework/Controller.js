/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/controller
  * @description    Controller Framework
  **/
'use strict'

/** @class          Controller
  *
  * Main controller class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Controller extends Entity {
  /** Object default
    *
    * Defines default values
    **/
  _default = {
    method: 'getAll'
  }
  /** Object method
    *
    * Contains all accepted methods
    **/
  method = {
    'getAll': function(data) {
      try {
        if(data.get('controller')) {
          let modelName = data.get('controller');
          if(Model.exists(modelName)) {
            Log.success({ 'message': `Calling model \"${modelName}\"` });
            let model = Model.construct(modelName, data.valueOf(), data);
            return model.invokeMethod();
          } else {
            Log.warning({ 'message': `Failed to call model \"${modelName}\"` });
            return false;
          }
        } else {
          Log.warning({ 'message': `No model supplied` });
          return false;
        }
      } catch(error) {
        Log.error({ 'message': `Failed to call model` });
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
        object.application = caller.caller;
        let dataSource = Entity.load(object.application.get('dataSource'));
        object.source = dataSource && dataSource.sources && dataSource.sources[name] ? dataSource.sources[name] : {};
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to construct controller \"${name}\"`, 'class': this.name });
    }
  }

  /** Static Method exists
    *
    * Returns true if the specified controller exists
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

  /** Method invokeMethod
    *
    * Invokes the controller method and returns processed data
    *
    * @return {object}
    **/
  invokeMethod() {
    let method = this.get('method', this._default.method);
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
