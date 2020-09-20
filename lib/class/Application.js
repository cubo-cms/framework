/** @package        cubo-cms/framework
  * @version        1.0.0
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         papiando
  * @description    Application Framework
  **/

module.exports = class Application {

  // Initialise application
  // @param config: initialisation file; defaults to .init.json
  constructor(config = '.init.json') {
    this.init(config);
  }

  loadClass(className) {
    return require('./' + className);
  }

  // Load application initialisation data
  // @param config: initialisation file
  // @return: application data
  init(config) {
    this.params = this.load(config);
    this.router = this.loadRouter(this.params.router);
  }

  // Load data, which can either be JSON or a file name containing JSON
  // @param data: string containing data or pointing to file name
  // @return: loaded data
  load(data) {
    try {
      return isJSON(data)? data: require(_root_ + '/' + data);
    } catch(error) {
      console.error('ERROR: Initialisation file not found');
    }
  }

  loadRouter(data) {
    try {
      var Router = require('./Router');
    } catch(error) {
      console.error('ERROR: Router class not found');
    }
    return new Router(data);
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
