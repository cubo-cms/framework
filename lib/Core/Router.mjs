/** @package        @cubo-cms/framework
  * @version        0.0.18
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
      '/': {
        'regex': '^\\/$',
        'dataType': 'Document'
      },
      '/{object}': {
        'regex': '^\\/([^/:]+)$',
        'dataType': '{object}'
      },
      '/{object}:{id}': {
        'regex': '^\\/([^/:]+):([^/:]+)$',
        'dataType': '{object}',
        'id': '{id}'
      },
      "/{object}/{filter}:{id}": {
        "regex": "^\\/([^/:]+)\\/([^/:]+):([^/:]+)$",
        "dataType": "{object}",
        "filter": "{filter}",
        "id": "{id}"
      }
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
    *
    * @param {object} request - request to be processed
    * @return {object}
    **/
  parse(request = this.data) {
    Log.info(`Router is parsing ${request.path}`)
    const url = new URL(request.path, 'https://localhost');
    // Store parsed query properties
    let postedParams = new URLSearchParams(request.payload);
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
    }
    for(const [property, value] of postedParams) {
      this.set(property, value);
    }
    let regexRoute = /^\/([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?([/:]+)?([^/:?]+)?$/g;
    let regexProp = /^\{([\w_-]+)\}$/g;
    let data = {};
    // Now start comparing each possible route with the url
    for(const [route, routeData] of Object.entries(this.route)) {
      let matchRequest = [...url.pathname.matchAll(regexRoute)][0] || [];
      let matchRoute = [...route.matchAll(regexRoute)][0] || [];
      let matched = true;
      for(let i = 1; i < matchRoute.length; i++) {
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
        break;
      } else {
        data = {};
      }
    }
    // Apply default in case no dataType is supplied
    data.dataType = data.dataType || Router.default.dataType;
    this.mergeData(data);
    return data;
  }
}
