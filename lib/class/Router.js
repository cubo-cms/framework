/** @package        cubo-cms/framework
  * @version        1.0.0
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         papiando
  * @description    Router Framework
  **/

module.exports = class Router {

  // Initialise router
  // @param routes: load defined routes for application
  constructor(routes) {
    this.init(routes);
  }

  // Load application defined routes
  // @param routes: defined routes
  // @return: application data
  init(routes) {
    this.params = new Framework.Params(routes);
  }

  get(param) {
    return this.params.get(param);
  }

  set(param, value, defaultValue) {
    this.params.set(param, value, defaultValue);
  }

  merge(params) {
    var result = this.params;
    Object.keys(params).forEach(function(key) {
      result.params[key] = params[key];
    });
  }

  parse(urlStr = null, routes = null) {
    var params;
    routes = routes? routes: this.get('routes');
    const url = new URL(urlStr);
    var urlPath = url.pathname.substr(1).split('/');
    const varMatch = /^\{{2}(.+?)\}{2}$/;
    Object.entries(routes).forEach(function(route) {
      var routePath = route[0].substr(1).split('/');
      params = {};
      if(urlPath.length == routePath.length) {
        var matched = true;
        for(var i = 0; i < urlPath.length; i++) {
          if(urlPath[i] != routePath[i] && varMatch.test(routePath[i])) {
            params[varMatch.exec(routePath[i])[1]] = urlPath[i];
          } else {
            matched = false;
          }
        };
        if(matched) {
          Object.keys(route[1]).forEach(function(key) {
            params[key] = route[1][key];
          });
          return params;
        }
      }
      return false;
    });
    this.merge(params);
  }
}
