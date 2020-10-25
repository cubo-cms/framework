/** @package        @cubo-cms/framework
  * @version        0.0.19
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         JSONDriver
  * @description    JSONDriver class - driver for JSON datasource (can only read)
  **/

import Driver from '../Core/Driver.mjs';

const methods = {
  get: async function(driver) {
    try{
      driver.pre = Core.load(driver.source.uri);
      driver.post = [];
      driver.unsorted = new Map();
      for(const item of driver.pre) {
        if(typeof item === 'object' && item[driver.get('sort')[0]])
          driver.unsorted.set(item[driver.get('sort')[0]], item);
        else
          driver.unsorted.set(item['id'], item);
      }
      if(driver.get('sort')[1] && driver.get('sort')[1] === 'down')
        driver.sorted = new Map([...driver.unsorted.entries()].sort().reverse());
      else
        driver.sorted = new Map([...driver.unsorted.entries()].sort());
      driver.sorted.forEach(function(item) {
        driver.matched = true;
        for(const property of Object.keys(item)) {
          if(driver.matched = driver.matched && JSONDriver.match(driver.get('query'), property, item[property])) {
            if(!JSONDriver.fields(driver.get('show'), driver.get('hide')).includes(property)) {
              delete(item[property])
            }
          }
        }
        if(driver.matched) {
          driver.post.push(item);
        }
      });
      if(driver.get('id')) {
        let result = driver.post[0];
        if(result) {
          return { ok: true, data: result, dataType: driver.get('dataType'), id: driver.get('id'), status: 'ok' };
        } else {
          return { ok: false, data: '', type: 'warning', status: 'notFound' }
        }
      } else {
        let result = driver.post;
        if(result) {
          let total = result.length;
          result = result.slice((driver.get('page') - 1) * driver.get('pageSize'), driver.get('page') * driver.get('pageSize'));
          return { ok: true, data: result, dataType: driver.get('dataType'), size: result.length, page: driver.get('page'), pageSize: driver.get('pageSize'), totalSize: total, status: 'ok' };
        } else {
          return { ok: false, data: '', type: 'error', status: 'badRequest' }
        }
      }
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
      if(property == queryName && !queryValue.includes(value))
        ok = false;
    }
    return ok;
  }
}
