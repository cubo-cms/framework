this['@data']/** @package        @cubo-cms/framework
  * @version        0.0.18
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Render
  * @description    Render class - Parses text and renders tags
  **/

String.prototype.replaceAll = function(regExp, routine) {
  let result = this;
  for(const match of [...result.matchAll(regExp)]) {
    result = result.split(match[0]).join(routine(match[0], match.slice(1)));
  }
  return result;
}

/** @module Render
  *
  * Render class - Parses text and renders tags
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Render extends Core {
  /** @property {object} format - holds routines to format tag values
    **/
  format = {
    count: (str) => {       // Returns count
      return str.length;
    },
    ucase: (str) => {       // Returns uppercase
      return str.toUpperCase();
    },
    lcase: (str) => {       // Returns lowercase
      return str.toLowerCase();
    },
    tcase: (str) => {       // Returns titlecase (first letter of each word caps)
      let word = str.toLowerCase().split(' ');
      for(const i = 0; i < part.length; i++) {
          word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
      }
      return word.join(' ');
    }
  };
  /** @property {object} rule - holds rules to render tags
    **/
  rule = {
    each: {                 // Each block
      regex: /\{%\s*each\s*([\w_.-]+)\s*of\s*([\w_.-]+)\s*%\}(.*)\{%\s*end\s*each\s*%\}/gm,
      routine: (str, match) => {
        if(this['@data'][match[1]]) {
          let result = '';
          for(const item of this['@data'][match[1]]) {
            this['@data'][match[0]] = item;
            result += this.render(match[2]);
          }
          return result;
        } else
          return this.render(match[2]);
      }
    },
    comment: {              // Comment (left out)
      regex: /\{#(.*)#\}/gm,
      routine: (str, match) => {
        return '';
      }
    },
    var: {                  // Variable
      regex: /\{\s*([\w_.-]+)(\s*\->\s*[^\}]+)?\s*\}/gm,
      routine: (str, match) => {
        let parts = match[0].split('.');
        let result = this['@data'];
        for(const part of parts) {
          if(result[part]) {
            result = result[part];
          } else {
            return str;
          }
        }
        if(match[1]) {
          let format = match[1].substring(1, match[1].length - 1);
          return this.format[format] ? this.format[format](result) : result;
        } else {
          return result;
        }
      }
    }
  };
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to default route
    **/
  constructor(data) {
    super();
    this['@data'] = data;
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
