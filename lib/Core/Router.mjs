/** @package        @cubo-cms/framework
  * @version        0.0.19
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
    dataType: 'Document',
    method: 'get',
    route: {
      '/': { dataType: 'Document' },
      '/favicon.ico': { method: 'skip' },
      '/{$dataType}': {},
      '/{$dataType}:{$id}': {},
      "/{$dataType}/{$filter}:{$id}": {}
    }
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to default route
    **/
  constructor(data = null) {
    super(data);
    this.route = Router.default.route;
  }
  /** @function parse(request)
    *
    * Function parse - parses a requested URL and returns parsed data
    *
    * @param {object} request - request to be processed
    * @return {object}
    **/
  parse(request = this.data) {
    Log.info(`Router is parsing ${request.path}`)
    const url = new URL(request.path, 'https://localhost');
    const requestURL = request.method + ' ' + url.pathname;
    // Store payload
    if(request.contentType === 'application/json') {
      this.set('payload', JSON.parse(request.payload));
    } else {
      let payload = {};
      let postedParams = new URLSearchParams(request.payload);
      for(const [property, value] of postedParams) {
        payload[property] = value;
      }
      this.set('payload', payload);
    }
    // Store parsed query properties
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
    }
    let regexRoute = /^([A-Z]+)\s\/([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?$/g;
    let regexProp = /^\{([\w_-]+)\}$/g;
    let data = {};
    // Now start comparing each possible route with the url
    for(const [route, routeData] of Object.entries(this.route)) {
      let matchRequest = [...requestURL.matchAll(regexRoute)][0] || [];
      let matchRoute = [...route.matchAll(regexRoute)][0] || [];
      let matched = true;
      for(let i = 1; i < matchRoute.length && matched; i++) {
        if(matchRoute[i] && matchRoute[i].match(regexProp)) {
          if(matchRequest[i]) {
            data[matchRoute[i].replace(regexProp, '$1')] = matchRequest[i];
          } else {
            matched = false;
          }
        } else {
          matched &= (matchRoute[i] === matchRequest[i]);
        }
      }
      if(matched) {
        this.merge(routeData);
        break;
      } else {
        data = {};
      }
    }
    // Apply default in case no dataType and method is supplied
    data.dataType = data.dataType || Router.default.dataType;
    data.method = request.method.toLowerCase() || Router.default.method;
    this.merge(data);
    console.log(this.data);
    return this.data;
  }
}
