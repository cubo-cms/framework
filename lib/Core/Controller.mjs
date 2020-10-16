/** @package        @cubo-cms/framework
  * @version        0.0.15
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
    get: async function(controller) {
      let model = controller.model(controller['@data']);
      let result = await model.invokeMethod();
      let view = controller.view({ output: result, method: controller.get('format') });
      return await view.invokeMethod(controller.get('format'));
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
  /** @function dataType()
    *
    * Getter function dataType - returns the dataType for this controller
    *
    * @return {string}
    **/
  get dataType() {
    return this.get('dataType');
  }
  /** async @function invokeMethod()
    *
    * Asynchronous function invokeMethod - Invokes controller method and returns processed data
    *
    * @return {object}
    **/
  async invokeMethod() {
    let method = this.get('method', Controller.default.method);
    if(method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`Controller invokes method \"${method}\"`);
        return await this.method[method](this);
      } else {
        Log.warning(`Controller failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Controller could not determine method`);
    }
  }
  /** @function model(data)
    *
    * Function model - returns model object
    *
    * @param {string||object} data - data to be passed to model
    * @return {object}
    **/
  model(data = {}) {
    if(this.get('dataType')) {
      let dataType = this.get('dataType');
      if(Model.exists(dataType)) {
        Log.success(`Controller invokes model \"${dataType}\"`);
        return Model.construct(dataType, data, this);
      } else {
        throw new FrameworkError({ message: `Controller failed to invoke model \"${dataType}\"`, type: 'warning' });
      }
    } else {
      throw new FrameworkError({ message: `Controller could not determine model`, type: 'warning' });
    }
  }
  /** @function view(data)
    *
    * Function view - returns view object
    *
    * @param {string||object} data - data to be passed to view
    * @return {object}
    **/
  view(data = {}) {
    if(this.get('dataType')) {
      let dataType = this.get('dataType');
      if(View.exists(dataType)) {
        Log.success(`Controller invokes view \"${dataType}\"`);
        return View.construct(dataType, data, this);
      } else {
        throw new FrameworkError({ message: `Controller failed to invoke view \"${dataType}\"`, type: 'warning' });
      }
    } else {
      throw new FrameworkError({ message: `Controller could not determine view`, type: 'warning' });
    }
  }
  /** Static @function construct(name,data,caller)
    *
    * Static function construct - Creates a new controller for specified dataType
    *
    * @param {string} name
    * @param {string||object} data - to be passed on to new controller
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(dataType = '', data = {}, caller = null) {
    try {
      if(Controller.exists(dataType)) {
        let controller = new Namespace.namespace[dataType + this.name](data);
        controller.caller = caller;
        controller.application = caller.caller;
        let dataSource = Core.load(controller.application.get('dataSource')) || {};
        controller.set('source', dataSource[dataType], {});
        return controller;
      } else {
        return false;
      }
    } catch(error) {
      throw new FrameworkError({ message: `Controller failed to construct \"${dataType}\"`, type: 'error' });
    }
  }
  /** Static @function exists(name)
    *
    * Static function exists - Returns true if the specified controller exists
    *
    * @param {string} name
    * @return {bool}
    **/
  static exists(dataType = '') {
    return Namespace.isLoaded(dataType + this.name);
  }
}
