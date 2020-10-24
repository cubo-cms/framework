/** @package        @cubo-cms/framework
  * @version        0.0.18
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Renderer
  * @description    Renderer class - Parses text and renders tags
  **/

String.prototype.replaceAll = function(regExp, routine) {
  let result = this;
  for(const match of [...result.matchAll(regExp)]) {
    result = result.split(match[0]).join(routine(match[0], match.slice(1)));
  }
  return result;
}

/** @module Renderer
  *
  * Renderer class - Parses text and renders tags
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Renderer extends Core {
  /** @property {object} format - holds routines to format tag values
    **/
  format = {};
  /** @property {object} rule - holds rules to render tags
    **/
  rule = {};
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to default route
    **/
  constructor(data) {
    super(data);
  }
  /** @function render(text)
    *
    * Function render - renders tags in text
    *
    * @param {string} text
    * @return {string}
    **/
  render(text) {
    for(const rule of Object.values(this.rule)) {
      text = text.replaceAll(rule.regex, rule.routine);
    }
    return text;
  }
}
