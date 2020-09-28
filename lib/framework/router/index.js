/** @package        @cubo-cms/framework
  * @version        0.0.5
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

  // Load application defined routes
  // @param param: defined routes
  // @return: application data
  init(param) {
    this.param = new Cubo.Param({ });
    this.routes = this.param.load(param).routes;
  }

  get(property) {
    return this.param.get(property);
  }

  set(property, value, defaultValue = null) {
    this.param.set(property, value, defaultValue);
  }

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

  invokeController() {
    try {
      if(this.get('controller') && typeof(Cubo[this.get('controller').toCapitalised() + 'Controller']) == 'function') {
        var controller = new Cubo[this.get('controller').toCapitalised() + 'Controller'](this.params);
        (typeof(app.log) !== 'undefined') && app.log.success({ 'module': moduleName, 'message': `Invoked Controller \"${this.get('controller').toCapitalised()}\"` });
        return controller;
      } else {
        (typeof(app.log) !== 'undefined') && app.log.warning({ 'module': moduleName, 'message': `Cannot find Controller \"${this.get('controller').toCapitalised()}\"` });
      }
    } catch(error) {
      (typeof(app.log) !== 'undefined') && app.log.error({ 'module': moduleName, 'message': `Cannot invoke Controller \"${this.get('controller').toCapitalised()}\"` });
    }
  }
}
