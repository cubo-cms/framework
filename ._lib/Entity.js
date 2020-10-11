/** @package        @cubo-cms/generic
  * @version        0.0.2
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/entity
  * @description    Entity Object
  **/
'use strict'

const fs = require('fs');
const path = require('path');

// TODO: Modify coalesce operator || to ?? when ES2020 is supported

/** @class          Entity
  *
  * Base class allowing manipulation of all objects in the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Entity {
  #caller;
  #class;
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty object
    **/
  constructor(data = {}) {
    this.#class = this.__proto__.constructor.name;
    this['@data'] = {};
    this.load(data);
  }
  /** Getter caller
    *
    * Returns the object that created this object
    *
    * @return {string}
    **/
  get caller() {
    return this.#caller;
  }
  /** Getter className
    *
    * Returns the name of the class
    *
    * @return {string}
    **/
  get class() {
    return this.#class;
  }
  /** Getter id
    *
    * Returns the object id
    *
    * @return {int}
    **/
  get _id() {
    return this.get('_id');
  }
  /** Getter name
    *
    * Returns the object name
    *
    * @return {string}
    **/
  get _name() {
    return this.get('_name');
  }
  /** Getter path
    *
    * Returns the object path
    *
    * @return {string}
    **/
  get _path() {
    return this.get('_path');
  }
  /** Getter type
    *
    * Returns the object type
    *
    * @return {string}
    **/
  get _type() {
    return this.get('_type');
  }
  /** Setter caller
    *
    * Stores the object that created this object
    *
    * @param {object} caller
    **/
  set caller(caller) {
    this.#caller = caller;
  }
  /** Method _ - short-hand for method get
    *
    * Returns the value of a property
    *
    * @param {string} property
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string}
    **/
  _(property, defaultValue = null) {
    return this.get(property, defaultValue);
  }
  /** Method get
    *
    * Returns the value of a property
    *
    * @param {string} property
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string}
    **/
  get(property, defaultValue = null) {
    let regex = /^\{(.+?)\}$/;
    let value = this['@data'][property] || defaultValue;
    return regex.test(value) ? this['@data'][value] || value : value;
  }
  /** Method load
    *
    * Merges data from a loaded object
    *
    * @param {string||object} data - either a path or an object
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string||object}
    **/
  load(data = {}, defaultData = {}) {
    data = Entity.load(data, defaultData);
    this.merge(data || defaultData);
    return this;
  }
  /** Static Method load
    *
    * Loads data from a path or returns object object
    *
    * @param {string||object} data - either a path or an object
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string||object}
    **/
  static load(data = {}, defaultData = null) {
    let id;
    if(id = Entity.resolve(data)) {
      if(data.includes('//')) {
        Log.debug({ 'message': `External source... Should be fetched\"`, 'class': Entity.name });
      } else {
        try {
          if(fs.existsSync(id) || fs.existsSync(id + '.js') || fs.existsSync(id + '.json')) {
            data = require(id);
          } else {
            // Soft fail
            data = null;
          }
        } catch(error) {
          Log.warning({ 'message': `Failed requiring data from \"${id}\"`, 'class': Entity.name });
          data = null;
        }
      }
    } else if(typeof(data) != 'object') {
      // Soft fail
      data = null;
    }
    return data || defaultData;
  }
  /** Static Method loadFile
    *
    * Loads a file
    *
    * @param {string} fileName - an absolute or relative file path
    * @return {object}
    **/
  static loadFile(fileName = null) {
    let filePath = Entity.resolve(fileName);
    if(filePath) {
      if(filePath.includes('//')) {
        Log.debug({ 'message': `External source... Should be fetched\"`, 'class': Entity.name });
        return null;
      } else {
        try {
          return fs.readFileSync(filePath);
        } catch(error) {
          Log.warning({ 'message': `Failed requiring data from \"${filePath}\"`, 'class': Entity.name });
          return null;
        }
      }
    } else {
      // Soft fail
      return null;
    }
  }
  /** Method merge
    *
    * Merges the data
    *
    * @param {object} data
    **/
  merge(data) {
    // Copy one by one to avoid referenced object
    for(const [property, value] of Object.entries(data)) {
      this[property] = data[property];
    }
    return this;
  }
  /** Method reset
    *
    * Removes a property
    *
    * @param {string} property
    **/
  reset(property) {
    delete this['@data'][property];
  }
  /** Static Method resolve
    *
    * Constructs a path from absolute or relative input
    *
    * @param {string} thisPath - absolute or relative path; '#' resolves to web root
    * @return {string}
    **/
  static resolve(thisPath = '.') {
    if(typeof(thisPath) == 'string') {
      if(thisPath.includes('//')) {
        return thisPath;
      } else {
        return path.isAbsolute(thisPath) ? thisPath : thisPath.startsWith('#/') ? path.join(__base, thisPath.substr(1)) : path.resolve(__dirname, thisPath);
      }
    } else
      return null;
  }
  /** Method select
    *
    * Returns only the specified properties of the data
    *
    * @param {array||string} property - either a single property or a set of properties
    * @return {object}
    **/
  select(property) {
    if(typeof(property) == 'object') {
      let result = {};
      for(let item of property) {
        if(this['@data'].hasOwnProperty(item)) result[item] = this.get(item);
      }
      return result;
    } else if(typeof(property) == 'string') {
      return this.select([property]);
    } else {
      return this['@data'];
    }
  }

  /** Method set
    *
    * Sets a property to a value
    *
    * @param {string} property
    * @param {string} value
    * @param {string} defaultValue - default value if value is empty
    **/
  set(property, value, defaultValue) {
    this['@data'][property] = value || defaultValue;
  }

  /** Method toJSON
    *
    * Returns the properties
    *
    * @return {object}
    **/
  toJSON() {
    return this['@data'];
  }

  /** Method toString
    *
    * Returns the properties as a stringified JSON object
    *
    * @return {string}
    **/
  toString() {
    return JSON.stringify(this['@data']);
  }

  /** Method valueOf
    *
    * Returns the properties
    *
    * @return {object}
    **/
  valueOf() {
    return this['@data'];
  }
}