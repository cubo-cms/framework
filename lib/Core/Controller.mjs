/** @package        @cubo-cms/framework
  * @version        0.0.12
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Controller
  * @description    Controller class - Retrieves data from model and passes it to view
  **/

  /** @module Controller
    *
    * Controller class - Retrieves data from model and passes it to view
    *   NOTE: Depends on @cubo-cms/core
    **/
export default class Controller extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    method: 'get'
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    'get': function(data) {
      if(data.get('name')) {
        data.set('query', data.get('name'));
      }
      try {
        if(data.get('controller')) {
          let modelName = data.get('controller');
          if(Model.exists(modelName)) {
            Log.success(`Controller calls model \"${modelName}\"`);
            let model = Model.construct(modelName, data['@data'], data);
            return model.invokeMethod();
          } else {
            Log.warning(`Controller failed to call model \"${modelName}\"`);
            return false;
          }
        } else {
          Log.warning(`Controller could not determine model`);
          return false;
        }
      } catch(error) {
        Log.error(`Controller failed to call model`);
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
  /** @function controller()
    *
    * Getter function controller - returns the name of the object for this controller
    *
    * @return {string}
    **/
  get controller() {
    return this.class.substring(0, this.class.length - super.class.length);
  }
  /** Static @function construct(name,data,caller)
    *
    * Static function construct - Creates a new controller with specified name
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(name = '', data = {}, caller = null) {
    try {
      if(Controller.exists(name)) {
        let object = new Namespace.namespace[name + this.name](data);
        object.caller = caller;
        object.application = caller.caller;
        let dataSource = Core.load(object.application.get('dataSource'));
        object.source = dataSource && dataSource.sources && dataSource.sources[name] ? dataSource.sources[name] : {};
        return object;
      } else {
        return false;
      }
    } catch(error) {
      Log.error(`Controller failed to construct \"${name}\"`);
    }
  }
  /** Static @function exists(name)
    *
    * Static function exists - Returns true if the specified controller exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(name = '') {
    return Namespace.isLoaded(name + this.name);
  }
  /** @function invokeMethod()
    *
    * Function invokeMethod - Invokes controller method and returns processed data
    *
    * @return {object}
    **/
  invokeMethod() {
    let method = this.get('method', Controller.default.method);
    if(method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`Controller invokes method \"${method}\"`);
        return this.method[method](this);
      } else {
        Log.warning(`Controller failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Controller could not determine method`);
    }
  }
}
