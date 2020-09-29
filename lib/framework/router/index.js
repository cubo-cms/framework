/** @package        @cubo-cms/framework
  * @version        0.0.6
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/router
  * @description    Router Framework
  **/
const moduleName = 'framework';

String.prototype.toCapitalised = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = class Router {
  // Initialise router
  // @param param: load defined routes for application
  constructor(param) {
    this.init(param);
  }

  // Load router data
  // @param param: router data
  // @return: parameters
  init(param) {
    this.param = new Cubo.Param({ });
    this.routes = this.param.load(param).routes;
  }

  // Shorthand to retrieve value of property
  // @param property: property of value to be retrieved
  // @return: retrieved value
  get(property) {
    return this.param.get(property);
  }

  // Shorthand to assign property a value; if none given use default value
  // @param property: property to be assigned to
  // @param value: value to be assigned
  // @param defaultValue: optional default value to be assigned
  set(property, value, defaultValue = null) {
    this.param.set(property, value, defaultValue);
  }

  // Parse the URL to determine controller, method, and other parameters
  // @param request: URL part of the request
  // @return: parameters
  parse(request) {
    const url = new URL(request, 'https://localhost');
    const varMatch = /^\{{2}(.+?)\}{2}$/;
    let urlPath = url.pathname.substr(1).split('/');
    for(var [route, param] of Object.entries(this.routes)) {
      let routePath = route.substr(1).split('/');
      if(urlPath.length == routePath.length) {
        let matched = true;
        for(var i = 0; i < urlPath.length; i++) {
          if(urlPath[i] != routePath[i] && varMatch.test(routePath[i])) {
            param[varMatch.exec(routePath[i])[1]] = urlPath[i];
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
    this.param.merge(param);
    // Merge parsed query properties
    for(const [property, value] of url.searchParams) {
      this.set(property, value);
    }
    return param;
  }

  // Invoke a new controller
  // @return: controller object; false on error
  invokeController() {
    try {
      if(this.get('controller') && typeof(Cubo[this.get('controller').toCapitalised() + 'Controller']) == 'function') {
        this.controller = new Cubo[this.get('controller').toCapitalised() + 'Controller'](this.param);
        (typeof(app.log) !== 'undefined') && app.log.success({ 'module': moduleName, 'message': `Invoked Controller \"${this.get('controller').toCapitalised()}\"` });
        return this.controller;
      } else {
        (typeof(app.log) !== 'undefined') && app.log.warning({ 'module': moduleName, 'message': `Cannot find Controller \"${this.get('controller').toCapitalised()}\"` });
        return false;
      }
    } catch(error) {
      (typeof(app.log) !== 'undefined') && app.log.error({ 'module': moduleName, 'message': `Cannot invoke Controller \"${this.get('controller').toCapitalised()}\"` });
      return false;
    }
  }
}
