/** @package        @cubo-cms/framework
  * @version        0.0.16
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
  constructor(data = Router.default.route) {
    super();
    try {
      this.route = Core.load(data);
    } catch(error) {
      Log.warning(`Router failed to load route list`);
    }
  }
  /** @function controller(data)
    *
    * Function controller - returns controller object
    *
    * @param {string||object} data - data to be passed to controller
    * @return {object}
    **/
  controller(data = {}) {
    if(this.get('dataType')) {
      let dataType = this.get('dataType');
      Log.info(`Router will start controller instance for \"${dataType}\"`);
      return Controller.construct(dataType, data, this);
    } else {
      throw new FrameworkError({ message: `Router could not determine controller instance name`, type: 'warning' });
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
  parse(path = this['@data'].path) {
    Log.info(`Router is parsing ${path}`)
    const url = new URL(path, 'https://localhost');
    let data = {};
    // Store parsed query properties
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
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
    // Apply default in case no dataType is supplied
    data.dataType = data.dataType || Router.default.dataType;
    // Now verify if the dataType is not pointing to a file (a dot in the name says enough)
    let collectedData = new Core();
    collectedData['@data'] = data;
    if(collectedData.get('dataType').indexOf('.') == -1) {
      // Store parsed route in @data
      this.mergeData(data);
    } else {
      // Quietly return feedback
      Log.warning(`Router could not validate controller`);
      this['@data'] = { message: `Possibly looking for a file`, result: 'warning', payload: collectedData.get('dataType') };
    }
    return data;
  }
}
