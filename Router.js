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
    this.params = this.load(routes);
    console.log(this.params);
  }

  // Load data, which can either be JSON or a file name containing JSON
  // @param data: string containing data or pointing to file name
  // @return: loaded data
  load(data) {
    try {
      return isJSON(data)? data: require(_root_ + '/' + data);
    } catch(error) {
      console.error('ERROR: Router file not found');
    }
  }
}

// Local function to detect whether the data is JSON formatted
// @param data: string
// @return: true if string is JSON formatted; false if not
function isJSON(data) {
  try {
    JSON.parse(data);
  } catch(error) {
    return false;
  }
  return true;
}
