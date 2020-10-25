/** @package        @cubo-cms/framework
  * @version        0.0.19
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
  /** @property {object} access - limits access to documents
    **/
  static access = {
    guest: {
      view: { accessLevel: ['public','private','unauthenticated'], documentStatus: ['published'] },
      list: { accessLevel: ['public','unauthenticated'], documentStatus: ['published'] }
    },
    user: {
      view: { accessLevel: ['public','private','authenticated'], documentStatus: ['published'] },
      list: { accessLevel: ['public','authenticated'], documentStatus: ['published'] }
    },
    author: {
      view: { accessLevel: ['public','private','authenticated'], documentStatus: ['published','unpublished'] },
      list: { accessLevel: ['public','authenticated'], documentStatus: ['published','unpublished'] }
    },
    editor: {
      view: { accessLevel: ['public','private','authenticated'], documentStatus: ['published','unpublished'] },
      list: { accessLevel: ['public','authenticated'], documentStatus: ['published','unpublished'] }
    },
    publisher: {
      view: { accessLevel: ['public','private','authenticated','unauthenticated'], documentStatus: ['published','unpublished','archived','trashed'] },
      list: { accessLevel: ['public','private','authenticated','unauthenticated'], documentStatus: ['published','unpublished','archived','trashed'] }
    },
    manager: {
      view: { accessLevel: ['public','private','authenticated','unauthenticated'], documentStatus: ['published','unpublished','archived','trashed'] },
      list: { accessLevel: ['public','private','authenticated','unauthenticated'], documentStatus: ['published','unpublished','archived','trashed'] }
    },
    administrator: {
      view: { accessLevel: ['public','private','authenticated','unauthenticated','system'], documentStatus: ['published','unpublished','archived','trashed'] },
      list: { accessLevel: ['public','private','authenticated','unauthenticated','system'], documentStatus: ['published','unpublished','archived','trashed'] }
    }
  }
  /** @property {object} default - holds default values
    **/
  static default = {
    method: 'get'
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    get: async function(controller) {
      // Limit access to documents according to user role
      let access = Controller.access[controller.session.userRole];
      if(controller.get('id') && !controller.get('filter'))
        controller.set('query', Object.assign({}, access.view));
      else
        controller.set('query', Object.assign({}, access.list));
      // Invoke controller method
      let model = controller.model(controller.data);
      let data = await model.invokeMethod();
      // If data returned is valid, call view, otherwise return result
      if(data.ok) {
        let view = controller.view(data);
        return await view.invokeRender();
      } else {
        return data;
      }
    },
    skip: async function(controller) {
      return { ok: true };
    }
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
      Log.info(`Controller starts model instance for \"${dataType}\"`);
      let model = Model.construct(dataType, data, this);
      model.controller = this;
      model.source = this.source;
      return model;
    } else {
      throw new FrameworkError({ message: `Controller could not determine model instance name`, type: 'warning' });
    }
  }
  /** async @function request(data)
    *
    * Asynchronous function request - request data internally
    *
    * @param {object} data - data to be passed to new controller
    * @return {object}
    **/
  async request(data) {
    if(data.dataType && data.id) {
      let dataType = data.dataType;
      Log.info(`Controller will request additional data from \"${dataType}\"`);
      data.method = 'get';
      data.show = 'id,name,description,body';
      data.render = 'json';
      data.session = this.get('session');
      let controller = Controller.construct(dataType, data, _app_);
      if(controller) {
        return await controller.invokeMethod();
      } else {
        return undefined;
      }
    } else {
      throw new FrameworkError({ message: `Controller could not determine instance name`, type: 'warning' });
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
      Log.info(`Controller starts view instance for \"${dataType}\"`);
      let view = View.construct(dataType, data, this);
      view.controller = this;
      return view;
    } else {
      throw new FrameworkError({ message: `Controller could not determine view instance name`, type: 'warning' });
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
    let dataSource = Core.load(caller.get('dataSource')) || {};
    let controller;
    if(dataSource[dataType]) {
      try {
        if(Controller.exists(dataType)) {
          controller = new Namespace.loaded[dataType](data);
          Log.debug({ message: `Controller starts named instance`, class: this.name });
        } else {
          controller = new Controller(data);
          Log.debug({ message: `Controller starts generic instance`, class: this.name });
        }
        controller.caller = caller;
        controller.application = caller;
        controller.source = dataSource[dataType];
        return controller;
      } catch(error) {
        throw new FrameworkError({ message: `Controller failed to start instance`, type: 'error', class: this.name });
      }
    } else {
      throw new FrameworkError({ message: `Controller instance \"${dataType}\" does not have a data source`, type: 'error', class: this.name });
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
    return Namespace.isLoaded(dataType);
  }
}
