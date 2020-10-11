/** @package        @cubo-cms/driver
  * @type           module
  * @version        0.0.1
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/driver/JSONDriver
  * @description    JSON Driver (can only read)
  **/
'use strict'

const methods = {
  'find': function(data) {
    try {
      data.pre = Entity.load(data.source.uri);
      data.post = {};
      for(const item of data.pre) {
        data.process = new Map(Object.entries(item));
        data.sortValue = data.nameValue = null;
        data.matched = true;
        data.process.forEach(function(value, key) {
          if(this.matched = this.matched && JSONDriver.match(this.get('query'), key, value)) {
            if(key == 'name')
              this.nameValue = value;
            if(key == (this['@data'].sort || 'name'))
              this.sortValue = value;
            if(this.get('columns') && !this.get('columns').includes(key))
              this.process.delete(key);
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
        for (let key of data.post[item].keys())
          obj[key] = data.post[item].get(key);
        data.data.push(obj);
      }
      return JSON.stringify(data.data, null, 2);
    } catch (error) {
      console.log(error);
    }
  }
}

/** @class          JSONDriver
  *
  * Driver for JSON queries
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class JSONDriver extends Driver {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.debug('Started JSON Driver');
  }
  /** Static Method isRegExp
    *
    * Returns true if string is a valid regular expression
    *
    * @param {string} str
    * @return {bool}
    **/
  static isRegExp(str) {
    try {
      return new RegExp(str);
    } catch(error) {
      return false;
    }
  }
  /** Static Method match - validates key value pair against query
    *
    * Returns false if key value pair does not satisfy query
    *
    * @param {object} query
    * @param {string} key
    * @param {string} value
    * @return {bool}
    **/
  static match(query, key, value) {
    let ok = true;
    // Skip if no query is given
    if(!query)
      return ok;
    // Match every value
    if(typeof(query) == 'object') {
      for(let [queryName, queryValue] of Object.entries(query)) {
        if(key == queryName && (JSONDriver.isRegExp(queryValue) ? JSONDriver.isRegExp(queryValue).test(value) == false : value != queryValue))
          ok = false;
      }
    // Short method assumes name
    } else if(typeof(query) == 'string') {
      if(key == 'name' && value != query)
        ok = false;
    }
    return ok;
  }
}

module.exports = JSONDriver;
