/** @package        @cubo-cms/framework
  * @version        0.0.11
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/router
  * @description    Router Object
  **/

// TODO: Consider parsing name differently, such as: /article/category:news/ or /article:12

/** @class          Router
  *
  * Router class allows parsing of URLs
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Router extends Entity {
  /** Object default
    *
    * Defines default values
    **/
  _default = {
    controller: 'Article',
    httpMethod: 'get',
    method: 'getAll',
    route: {
      '/': { 'regex': '^\\/$', 'controller': 'Article', 'method': 'getAll' },
      '/{controller}': { 'regex': '^\\/([^/:]+)$', 'controller': '{controller}', 'method': 'getAll' },
      '/{controller}:{name}': { 'regex': '^\\/([^/:]+):([^/:]+)$', 'controller': '{controller}', 'method': 'get', 'name': '{name}' }
    }
  }
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data
    **/
  constructor(data = {}) {
    super();
    try {
      this.route = Entity.load(data);
    } catch(error) {
      Log.warning({ 'message': `Failed to load route list`, 'class': this.class })
    }
  }
  /** Method callController - Get a new controller object
    *
    * Returns controller object
    *
    * @param {string||object} data - data to be passed to controller
    * @return {object}
    **/
  callController(data = {}) {
    try {
      if(this.get('controller')) {
        let controller = this.get('controller');
        if(Controller.exists(controller)) {
          Log.success({ 'message': `Calling controller \"${controller}\"`, 'class': this.class });
          return Controller.construct(controller, data, this);
        } else {
          Log.warning({ 'message': `Failed to call controller \"${controller}\"`, 'class': this.class });
          return false;
        }
      } else {
        Log.warning({ 'message': `No controller supplied`, 'class': this.class });
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to call controller`, 'class': this.class });
      return false;
    }
  }
  /** Method mergeData
    *
    * Merges the data into @data
    *
    * @param {object} data
    **/
  mergeData(data) {
    // Copy one by one to avoid referenced object
    for(const [property, value] of Object.entries(data)) {
      this.set(property, value);
    }
    return this['@data'];
  }
  /** Method parse - Parse the requested URL
    *
    * Parse a requested URL and return parsed data
    *
    * @param {string} request - URL to be processed
    * @return {object}
    **/
  // TODO: Consider passing posted data as well
  parse(request = '/') {
    const url = new URL(request, 'https://localhost');
    let data = {};
    // Store httpMethod
    this.set('method', this.get('httpMethod'), this._default.httpMethod);
    // Store parsed query properties
    for(const [property, value] of url.searchParams) {
      try {
        this.set(property, JSON.parse(value));
      } catch(error) {
        Log.warning({'message': `No valid JSON in \"\"`, 'class': this.class });
      }
    }
    // Now start comparing each possible route with the url
    for(const [route, routeData] of Object.entries(this.route || this._default.route )) {
      let regex = new RegExp(routeData.regex, 'g');
      let matchRequest = [...url.pathname.matchAll(regex)][0] || [];
      let matchRoute = [...route.matchAll(regex)][0] || [];
      if(matchRequest.length && matchRoute.length) {
        for(let i = 1; i < matchRequest.length; i++) {
          data[matchRoute[i]] = matchRequest[i];
        }
        // Also store other properties supplied
        for(const [property, value] of Object.entries(routeData)) {
          if(property != 'regex') data[property] = value;
        }
        // Break away from loop
        break;
      } else {
        data = {};
      }
    }
    // Apply default in case no controller is supplied
    data.controller = data.controller || this._default.controller;
    // Store parsed route in @data
    this.mergeData(data);
    Log.debug({ 'message': `Parsed result: ${this.toString()}`, 'class': this.class });
    return data;
  }
}
