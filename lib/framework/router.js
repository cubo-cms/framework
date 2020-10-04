/** @package        @cubo-cms/framework
  * @version        0.0.10
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
    controller: 'Article'
  }
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data
    **/
  constructor(data = {}) {
    super();
    let router = Entity.load(data);
    this.routes = Entity.load(router.routes);
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

  /** Method parse - Parse the requested URL
    *
    * Parse a requested URL and return parsed data
    *
    * @param {string} request - URL to be processed
    * @return {object}
    **/
  // TODO: Consider passing posted data as well
  parse(request = '/') {
    const varMatch = /^\{{2}(.+?)\}{2}$/;
    const url = new URL(request, 'https://localhost');
    let urlPath = url.pathname.substr(1).split('/').filter(part => part);
    let data = {};
    // First get parsed query properties
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
    }
    // Now start comparing each possible route with the url
    for(const [route, value] of Object.entries(this.routes)) {
      let routePath = route.substr(1).split('/');
      if(urlPath.length == routePath.length) {
        let matched = true;
        data = Object.assign({}, value);
        for(var i = 0; i < urlPath.length; i++) {
          if(urlPath[i] != routePath[i] && varMatch.test(routePath[i])) {
            data[varMatch.exec(routePath[i])[1]] = urlPath[i];
          } else if(urlPath[i] != routePath[i]) {
            matched = false;
            break;
          }
        }
        if(matched) {
          // This is the route
          break;
        } else {
          // Not the one, try next route
          data = {};
        }
      }
    }
    // Apply default in case no controller is supplied
    data.controller = data.controller || this._default.controller;
    // Merge parsed path properties
    this['@data'] = data;
    Log.debug({ 'message': `Parsed result: ${this.toString()}`, 'class': this.class });
    return data;
  }
}
