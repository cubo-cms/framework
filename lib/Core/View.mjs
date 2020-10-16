/** @package        @cubo-cms/framework
  * @version        0.0.15
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         View
  * @description    View class - Formats data received from controller
  **/

/** @module View
  *
  * View class - Formats data received from controller
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class View extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    method: 'html5'
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    html5: async function(data) {
      data.set('result', 'success');
      data.set('contentType', 'text/html');
      data.set('output', '<pre>' + JSON.stringify(data.get('output'), null, 2) + '</pre>');
      return data['@data'];
    },
    json: async function(data) {
      data.set('result', 'success');
      data.set('contentType', 'application/json');
      data.set('output', JSON.stringify(data.get('output')));
      return data['@data'];
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
    * Getter function dataType - returns the dataType for this view
    *
    * @return {string}
    **/
  get dataType() {
    return this.get('dataType');
  }
  /** async @function invokeMethod(method)
    *
    * Asynchronous function invokeMethod - Invokes view method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  async invokeMethod(method = '') {
    if(method = method || View.default.method) {
      if(typeof this.method[method] === 'function') {
        Log.success(`View invokes method \"${method}\"`);
        return await this.method[method](this);
      } else {
        Log.warning(`View failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`View could not determine method`);
    }
  }
  /** Static @function construct(dataType,data,caller)
    *
    * Static function construct - Creates a new view with specified dataType
    *
    * @param {string} dataType
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(dataType = '', data = {}, caller = null) {
    if(View.exists(dataType)) {
      try {
        let view = new Namespace.namespace[dataType + this.name](data);
        view.caller = caller;
        return view;
      } catch(error) {
        throw new FrameworkError({ message: `View failed to construct \"${dataType}\"`, type: 'error' });
      }
    } else {
      throw new FrameworkError({ message: `View \"${dataType}\" does not exist`, type: 'error' });
    }
  }
  /** Static @function exists(dataType)
    *
    * Static function exists - Returns true if the specified view exists
    *
    * @param {string} dataType
    * @return {bool}
    **/
  static exists(dataType = '') {
    return Namespace.isLoaded(dataType + this.name);
  }
}
