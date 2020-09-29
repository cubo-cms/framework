/** @package        @cubo-cms/framework
  * @version        0.0.6
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/param
  * @description    Param Framework
  **/
const moduleName = 'framework';
// TODO: method to replace variables

module.exports = class Param {
  // Initialise parameters
  // @param param: parameter object or JSON file name
  constructor(param = { }) {
    this.param = this.load(param);
  }

  // Retrieve value of property
  // @param property: property of value to be retrieved
  // @return: retrieved value
  get(property) {
    return this.param[property];
  }

  // Assign property a value; if none given use default value
  // @param property: property to be assigned to
  // @param value: value to be assigned
  // @param defaultValue: optional default value to be assigned
  set(property, value, defaultValue = null) {
    this.param[property] = value ? value : defaultValue;
  }

  // Assign property a default value, if no value exists
  // @param property: property to be assigned to
  // @param defaultValue: optional default value to be assigned
  preset(property, defaultValue = null) {
    this.param[property] = this.param[property] ? this.param[property] : defaultValue;
  }

  // Load properties from object or JSON file
  // @param param: parameter object or JSON file name
  // @return: parameter object
  load(param) {
    try {
      return (typeof(param) == 'string') ? require(_root_ + '/' + param) : param;
    } catch(error) {
      console.error({ 'type': 'warning', 'module': moduleName, 'message': `Cannot find file \"${param}\"` } );
    }
  }

  // Merge properties from object or JSON file with existing ones
  // @param param: parameter object or JSON file name
  merge(param) {
    if(typeof(param) == 'object') {
      for(const [property, value] of Object.entries(this.load(param))) {
        this.set(property, value);
      }
    }
  }
}
