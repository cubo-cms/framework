/** @package        @cubo-cms/framework
  * @version        0.0.14
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
    get: function(object) {
      let model = object.callModel(object['@data']);
      let view = object.callView({ output: model.invokeMethod(object.get('method')), method: object.get('format') });
      return view.invokeMethod(object.get('format'));
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
  /** @function callModel(data)
    *
    * Function callModel - returns model object
    *
    * @param {string||object} data - data to be passed to model
    * @return {object}
    **/
  callModel(data = {}) {
    try {
      if(this.get('controller')) {
        let model = this.get('controller');
        if(Model.exists(model)) {
          Log.success(`Controller calls model \"${model}\"`);
          return Model.construct(model, data, this);
        } else {
          Log.warning(`Controller failed to call model \"${model}\"`);
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
  /** @function callView(data)
    *
    * Function callView - returns view object
    *
    * @param {string||object} data - data to be passed to view
    * @return {object}
    **/
  callView(data = {}) {
    try {
      if(this.get('controller')) {
        let view = this.get('controller');
        if(View.exists(view)) {
          Log.success(`Controller calls view \"${view}\"`);
          return View.construct(view, data, this);
        } else {
          Log.warning(`Controller failed to call view \"${view}\"`);
          return false;
        }
      } else {
        Log.warning(`Controller could not determine view`);
        return false;
      }
    } catch(error) {
      Log.error(`Controller failed to call view`);
      return false;
    }
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
        let dataSource = Core.load(object.application.get('dataSource')) || {};
        object.set('source', dataSource[name], {});
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
