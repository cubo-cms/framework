/** @package        @cubo-cms/framework
  * @type           module
  * @version        0.0.15
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         JSONDriver
  * @description    JSONDriver class - driver for JSON datasource (can only read)
  **/

import Driver from '../Core/Driver.mjs';

const methods = {
  get: async function(object) {
    try{
      object.pre = Core.load(object.get('uri'));
      object.post = [];
      object.unsorted = new Map();
      for(const item of object.pre) {
        if(typeof item === 'object' && item[object.get('sort')[0]])
          object.unsorted.set(item[object.get('sort')[0]], item);
        else
          object.unsorted.set(item['name'], item);
      }
      if(object.get('sort')[1] && object.get('sort')[1] === 'down')
        object.sorted = new Map([...object.unsorted.entries()].sort().reverse());
      else
        object.sorted = new Map([...object.unsorted.entries()].sort());
      object.sorted.forEach(function(item) {
        object.matched = true;
        for(const property of Object.keys(item)) {
          if(object.matched = object.matched && JSONDriver.match(object.get('query'), property, item[property])) {
            if(!JSONDriver.fields(object.get('show'), object.get('hide')).includes(property)) {
              delete(item[property])
            }
          }
        }
        if(object.matched) {
          object.post.push(item);
        }
      });
      return object.post.slice((object.get('page') - 1) * object.get('pageSize'), object.get('page') * object.get('pageSize'))
    } catch(error) {
      Log.error(error);
    }
  }
}

/** @module JSONDriver
  *
  * JSONDriver class - driver for JSON datasource (can only read)
  *
  * @param {string||object} data - data to be loaded on construct
  **/
export default class JSONDriver extends Driver {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.info(`Started ${this.class}`);
  }
  /** Static @function fields(show,hide)
    *
    * Static function fields - Returns constructed array of fields effectively shown
    *
    * @param {array} show
    * @param {array} hide
    * @return {array}
    **/
  static fields(show, hide) {
    let fields = show;
    for(const field of hide) {
      fields = fields.filter(item => item !== field);
    }
    return fields;
  }
  /** Static @function match(query,property,value)
    *
    * Static function match - Returns false if property/value pair does not satisfy the query
    *
    * @param {object} query
    * @param {string} property
    * @param {string} value
    * @return {bool}
    **/
  static match(query, property, value) {
    let ok = true;
    // Skip if no query is given
    if(!query)
      return ok;
    // Match every value
    for(let [queryName, queryValue] of Object.entries(query)) {
      if(property == queryName && value != queryValue)
        ok = false;
    }
    return ok;
  }
}
