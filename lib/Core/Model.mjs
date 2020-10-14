/** @package        @cubo-cms/framework
  * @version        0.0.14
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
    documentStatus: 'published',
    page: 1,
    pageSize: 100,
    show: ['name','title'],
    hide: ['_id'],
    sort: ['name','up']
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    get: function(object) {
      let driver = object.callDriver(object.prepareData(object['@data']));
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
  prepareData(data) {
    let query = {};
    // Apply filter
    if(this.get('filter') && this.get('id')) {
      query[this.get('filter')] = this.get('id');
      delete data['id'];
    }
    if(this.get('id')) query['name'] = this.get('id');
    // Fill in defaults, if not requested specifically
    data['page'] = Model.parseInt(this.get('page')) || Model.default.page;
    data['pageSize'] = Model.parseInt(this.get('pageSize')) || Model.default.pageSize;
    data['show'] = Model.parseArray(this.get('show')) || Model.default.show;
    data['hide'] = Model.parseArray(this.get('hide')) || Model.default.hide;
    data['sort'] = Model.parseArray(this.get('sort')) || Model.default.sort;
    // Pass all these on when constructing driver
    query['documentStatus'] = Model.parseString(this.get('documentStatus')) || Model.default.documentStatus;
    if(this.get('author')) query['author'] = Model.parseString(this.get('author'));
    data['query'] = query;
    return data;
  }
  /** @function invokeMethod(method)
    *
    * Function invokeMethod - Invokes model method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  invokeMethod(method = 'get') {
    if(typeof this.method[method] === 'function') {
      Log.success(`Model invoking method \"${method}\"`);
      return this.method[method](this);
    } else {
      Log.warning(`Model failed to invoke method \"${method}\"`);
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
  /** Static @function parseArray(data)
    *
    * Static function parseArray - Returns array of properties or values
    *
    * @param {string||array} data
    * @return {array}
    **/
  static parseArray(data) {
    if(typeof data !== 'array')
      if(data)
        return Array.from(data.matchAll(/([\w\-_]+)/g), m =>m[0]);
      else
        return undefined;
    else
      return data;
  }
  /** Static @function parseBool(data)
    *
    * Static function parseBool - Returns true or false from value
    *
    * @param {string||int||bool} data
    * @return {bool}
    **/
  static parseBool(data) {
    return data === 'true' || data;
  }
  /** Static @function parseInt(data)
    *
    * Static function parseInt - Returns integer value
    *
    * @param {string} data
    * @return {int}
    **/
  static parseInt(data) {
    if(data)
      return parseInt(data, 10);
    else
      return undefined;
  }
  /** Static @function parseString(data)
    *
    * Static function parseString - Returns string of property or value
    *
    * @param {string} data
    * @return {string}
    **/
  static parseString(data) {
    if(typeof data === 'string')
      return data.match(/([\w\-_]+)/g)[0];
    else
      return undefined;
  }
}
