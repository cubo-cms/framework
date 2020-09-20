/** @package        cubo-cms/framework
  * @version        1.0.0
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         papiando
  * @description    Params Framework
  **/

module.exports = class Params {

  // Initialise parameters
  // @param params: JSON formatted text or JSON file name
  constructor(params = null) {
    if(params)
      this.params = this.load(params);
  }

  get(param) {
    return this.params[param];
  }

  set(param, value, defaultValue) {
    this.params[param] = value? value: defaultValue;
  }

  load(params) {
    try {
      return isJSON(params)? params: require(_root_ + '/' + params);
    } catch(error) {
      console.error('ERROR: JSON file "' + params + '" not found');
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
