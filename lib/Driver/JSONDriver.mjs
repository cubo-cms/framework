/** @package        @cubo-cms/framework
  * @type           module
  * @version        0.0.12
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         JSONDriver
  * @description    JSONDriver class - driver for JSON datasource (can only read)
  **/

import Driver from '../Core/Driver.mjs';

const methods = {
  'find': function(data) {
    try {
      data.pre = Core.load(data.source.uri);
      data.post = {};
      for(const item of data.pre) {
        data.process = new Map(Object.entries(item));
        data.sortValue = data.nameValue = null;
        data.matched = true;
        data.process.forEach(function(value, property) {
          if(data.matched = data.matched && JSONDriver.match(data.get('query'), property, value)) {
            if(property == 'name')
              data.nameValue = value;
            if(property == (data['@data'].sort || 'name'))
              data.sortValue = value;
            if(data.get('columns') && !data.get('columns').includes(property))
              data.process.delete(property);
          }
        }, data);
        if(data.matched) {
          data.post[data.sortValue || data.nameValue] = data.process;
          delete data.sortValue;
          delete data.nameValue;
        }
        data.process = null;
      }
      data.data = [];
      for(let item of Object.keys(data.post)) {
        let obj = {};
        for (let property of data.post[item].keys())
          obj[property] = data.post[item].get(property);
        data.data.push(obj);
      }
      return JSON.stringify(data.data, null, 2);
    } catch (error) {
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
    Log.success(`Started ${this.class}`);
  }
  /** Static @function isRegExp(data)
    *
    * Static function isRegExp - Returns true if data is a valid regular expression
    *
    * @param {string} data
    * @return {bool}
    **/
  static isRegExp(data) {
    try {
      return new RegExp(data);
    } catch(error) {
      return false;
    }
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
    if(typeof(query) == 'object') {
      for(let [queryName, queryValue] of Object.entries(query)) {
        if(property == queryName && (JSONDriver.isRegExp(queryValue) ? JSONDriver.isRegExp(queryValue).test(value) == false : value != queryValue))
          ok = false;
      }
    // Short method assumes name
    } else if(typeof(query) == 'string') {
      if(property == 'name' && value != query)
        ok = false;
    }
    return ok;
  }
}
