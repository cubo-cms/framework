/** @package        @cubo-cms/framework
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/class/router
  * @description    Router framework
  **/
const moduleName = 'framework';

module.exports = class Router {

  // Initialise router
  // @param router: load defined routes for application
  constructor(router) {
    this.param = new Cubo.Param({});
    this.init(router);
  }

  // Load application defined routes
  // @param router: defined routes
  // @return: application data
  init(router) {
    this.routes = this.param.load(router).routes;
  }

  get(property) {
    return this.param.get(property);
  }

  set(property, value, defaultValue = null) {
    this.param.set(property, value, defaultValue);
  }

  parse(request) {
    const url = new URL(request.url, 'https://localhost');
    const varMatch = /^\{{2}(.+?)\}{2}$/;
    let urlPath = url.pathname.substr(1).split('/');
    for(var [route, param] of Object.entries(this.routes)) {
      let routePath = route.substr(1).split('/');
      if(urlPath.length == routePath.length) {
        let matched = true;
        for(var i = 0; i < urlPath.length; i++) {
          if(urlPath[i] != routePath[i] && varMatch.test(routePath[i])) {
            param[varMatch.exec(routePath[i])[1]] = urlPath[i];
          } else {
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
    if(this.param['controller']) {
      console.log('This should now start controller '+this.param['controller']);
      return new Cubo.Controller();
    }
  }
}
