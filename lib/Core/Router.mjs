/** @package        @cubo-cms/framework
  * @version        0.0.13
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Router
  * @description    Router class - Parses requests to determine controller
  **/

/** @module Router
  *
  * Router class - Parses requests to determine controller
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Router extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    controller: 'Article',
    httpMethod: 'get',
    method: 'getAll',
    route: {
      '/': { 'regex': '^\\/$', 'controller': 'Article', 'method': 'get' },
      '/{controller}': { 'regex': '^\\/([^/:]+)$', 'controller': '{controller}', 'method': 'get' },
      '/{controller}:{name}': { 'regex': '^\\/([^/:]+):([^/:]+)$', 'controller': '{controller}', 'method': 'get', 'name': '{name}' }
    }
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to default route
    **/
  constructor(data = Router.default.route) {
    super();
    try {
      this.route = Core.load(data);
    } catch(error) {
      Log.warning(`Router failed to load route list`);
    }
  }
  /** @function callController(data)
    *
    * Function callController - returns controller object
    *
    * @param {string||object} data - data to be passed to controller
    * @return {object}
    **/
  callController(data = {}) {
    try {
      if(this.get('controller')) {
        let controllerName = this.get('controller');
        if(Controller.exists(controllerName)) {
          Log.success(`Router calls controller \"${controllerName}\"`);
          let controller = Controller.construct(controllerName, data, this);
          return controller;
        } else {
          Log.warning(`Router failed to call controller \"${controllerName}\"`);
          return false;
        }
      } else {
        Log.warning(`Router could not determine controller`);
        return false;
      }
    } catch(error) {
      Log.error(`Router failed to call controller`);
      return false;
    }
  }
  /** @function mergeData(data)
    *
    * Function mergeData - Merges object into @data
    *
    * @param {object} data - URL to be processed
    **/
  mergeData(data) {
    // Copy one by one to avoid referenced object
    for(const [property, value] of Object.entries(data)) {
      this.set(property, value);
    }
    return this['@data'];
  }
  /** @function parse(request)
    *
    * Function parse - parses a requested URL and returns parsed data
    * TODO: Consider passing posted data as well
    *
    * @param {string} request - URL to be processed
    * @return {object}
    **/
  parse(request = '/') {
    const url = new URL(request, 'https://localhost');
    let data = {};
    // Store httpMethod
    this.set('method', this.get('httpMethod'), Router.default.httpMethod);
    // Store parsed query properties
    for(const [property, value] of url.searchParams) {
      try {
        this.set(property, JSON.parse(value));
      } catch(error) {
        Log.warning(`Router skips invalid search parameters`);
      }
    }
    // Now start comparing each possible route with the url
    for(const [route, routeData] of Object.entries(this.route)) {
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
    data.controller = data.controller || Router.default.controller;
    // Now verify if the controller is not pointing to a file (a dot in the name says enough)
    let collectedData = new Core();
    collectedData['@data'] = data;
    if(collectedData.get('controller').indexOf('.') == -1) {
      // Store parsed route in @data
      this.mergeData(data);
    } else {
      // Quietly return feedback
      Log.warning(`Router could not validate controller`);
      this['@data'] = { message: `Possibly looking for a file`, type: 'warning', payload: collectedData.get('controller') };
    }
    return data;
  }
}
