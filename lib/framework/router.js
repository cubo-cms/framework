/** @package        @cubo-cms/framework
  * @version        0.0.9
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/router
  * @description    Router Object
  **/

/** Prototype Function toProperCase
  *
  * Returns a string with the first letter capitalized
  *
  * @return {string}
  **/
String.prototype.toProperCase = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/** @class          Router
  *
  * Router class allows parsing of URLs
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Router extends Entity {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data
    **/
  constructor(data = {}) {
    super();
    this.routes = Entity.load(data).routes;
  }

  /** Method parse - Parse the requested URL
    *
    * Parse a requested URL and return parsed data
    *
    * @param {string} request - URL to be processed
    * @return {object}
    **/
  // TODO: Consider passing posted data as well
  parse(request) {
    const url = new URL(request, 'https://localhost');
    const varMatch = /^\{{2}(.+?)\}{2}$/;
    let urlPath = url.pathname.substr(1).split('/');
    let data;
    for(const [route, value] of Object.entries(this.routes)) {
      let routePath = route.substr(1).split('/');
      if(urlPath.length == routePath.length) {
        let matched = true;
        for(var i = 0; i < urlPath.length; i++) {
          data = Object.assign({}, value);
          if(urlPath[i] != routePath[i] && varMatch.test(routePath[i])) {
            data[varMatch.exec(routePath[i])[1]] = urlPath[i];
          } else if(urlPath[i] != routePath[i]) {
            matched = false;
          }
        }
        if(matched) {
          break;
        }
      }
    }
    // Merge parsed path properties
    this.merge(data);
    // Merge parsed query properties
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
    }
    return this._data;
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
        let controllerName = this.get('controller').toProperCase() + 'Controller';
        if(typeof(Cubo[controllerName]) == 'function') {
          Log.success({ 'message': `Calling controller \"${controllerName}\"`, 'class': Entity.name });
          let controller = new Cubo[controllerName](data);
          controller.calledBy = this;
          return controller;
        } else {
          Log.warning({ 'message': `Failed to call controller \"${controllerName}\"`, 'class': Entity.name });
          return false;
        }
      } else {
        Log.warning({ 'message': `No controller supplied`, 'class': Entity.name });
        return false;
      }
    } catch(error) {
      Log.error({ 'message': `Failed to call controller`, 'class': Entity.name });
      return false;
    }
  }

  /** Method invokeMethod
    *
    * Invokes the controller method and returns processed data
    *
    * @return {object}
    **/
  invokeMethod(controller) {
    let method = this.get('method');
    if(method) {
      if(typeof(controller[method]) == 'function') {
        Log.success({ 'message': `Invoking method \"${method}\"`, 'class': Entity.name });
        return controller[method]();
      } else {
        Log.warning({ 'message': `Failed to invoke method \"${method}\"`, 'class': Entity.name });
      }
    } else {
      Log.warning({ 'message': `No method specified`, 'class': Entity.name });
    }
  }
}
