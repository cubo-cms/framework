/** @package        @cubo-cms/framework
  * @version        0.0.18
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
    show: ['id', 'name', 'description', 'body', 'metadata'],
    hide: ['_id','password'],
    sort: ['name', 'up']
  }
  /** @property {object} method - holds all accepted methods
    **/
  method = {
    get: async function(model) {
      let driver = model.driver(model.prepareData());
      return await driver.invokeMethod(model.get('method'));
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
    * Getter function dataType - returns the dataType for this model
    *
    * @return {string}
    **/
  get dataType() {
    return this.get('dataType');
  }
  /** @function driver(data)
    *
    * Function driver - returns driver object
    *
    * @param {string||object} data - data to be passed to driver
    * @return {object}
    **/
  driver(data = {}) {
    if(this.get('driver', Model.default.driver)) {
      let driver = this.get('driver', Model.default.driver);
      if(Driver.exists(driver)) {
        Log.info(`Model starts driver instance for \"${driver}\"`);
        return Driver.construct(driver, data, this);
      } else {
        throw new FrameworkError({ message: `Model failed to invoke driver instance`, type: 'warning' });
      }
    } else {
      throw new FrameworkError({ message: `Model could not determine driver`, type: 'warning' });
    }
  }
  /** async @function invokeMethod()
    *
    * Asynchronous function invokeMethod - Invokes model method and returns processed data
    *
    * @return {object}
    **/
  async invokeMethod() {
    let method = this.get('method');
    if(method) {
      if(typeof this.method[method] === 'function') {
        Log.debug(`Model invokes method \"${method}\"`);
        return await this.method[method](this);
      } else {
        Log.warning(`Model failed to invoke method \"${method}\"`);
      }
    } else {
      Log.warning(`Model could not determine method`);
    }
  }
  /** @function prepareData()
    *
    * Function prepareData - Prepares data to pass on to driver
    *
    * @return {object}
    **/
  prepareData() {
    let data = Core.load(this.data);
    let query = this.get('query') || {};
    // Apply filter
    if(this.has('filter') && this.has('id')) {
      if(query[this.get('filter')]) {
        if(query[this.get('filter')].includes(this.get('id')))
          query[this.get('filter')] = [this.get('id')];
        else
          query[this.get('filter')] = [];
      } else {
        query[this.get('filter')] = [this.get('id')];
      }
      delete data['id'];
    }
    if(this.has('id'))
      query['id'] = [this.get('id')];
    // Fill in defaults, if not requested specifically
    data['page'] = Model.parseInt(this.get('page')) || Model.default.page;
    data['pageSize'] = Model.parseInt(this.get('pageSize')) || Model.default.pageSize;
    data['show'] = Model.parseArray(this.get('show')) || Model.default.show;
    data['hide'] = Model.parseArray(this.get('hide')) || Model.default.hide;
    data['sort'] = Model.parseArray(this.get('sort')) || Model.default.sort;
    // Pass all these on when constructing driver
    data['query'] = query;
    return data;
  }
  /** Static @function construct(dataType,data,caller)
    *
    * Static function construct - Creates a new model with specified name
    *
    * @param {string} dataType
    * @param {string||object} data - to be passed on to new model
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(dataType = '', data = {}, caller = null) {
    let model;
    try {
      if(Model.exists(dataType)) {
        model = new Namespace.loaded[dataType + this.name](data);
        Log.success(`Model starts named instance`);
      } else {
        model = new Model(data);
        Log.success(`Model starts generic instance`);
      }
      model.caller = caller;
      model.set('driver', Model.default.driver);
      model.merge(data.source);
      return model;
    } catch(error) {
      throw new FrameworkError({ message: `Model failed to start instance`, type: 'error' });
    }
  }
  /** Static @function exists(dataType)
    *
    * Static function exists - Returns true if the specified model exists
    *
    * @param {string} dataType
    * @return {bool}
    **/
  static exists(dataType = '') {
    return Namespace.isLoaded(dataType + this.name);
  }
  /** Static @function parseArray(data)
    *
    * Static function parseArray - Returns array of properties or values
    *
    * @param {string||array} data
    * @return {array}
    **/
  static parseArray(data) {
    if(!Array.isArray(data))
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
