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
  _param = {};
  #caller;

  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty object
    **/
  constructor(data = {}) {
    this._param = Entity.load(data);
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
  get className() {
    return this.prototype.name;
  }

  /** Getter name
    *
    * Returns the property name
    *
    * @return {string}
    **/
  get name() {
    return this.get('name');
  }

  /** Setter calledBy
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
    return this._param[property] || defaultValue;
  }

  /** Static Method load
    *
    * Loads data from a file, or assigns the value specified
    *
    * @param {string||object} data - either a file name or the value to be assigned
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string||object}
    **/
  static load(data, defaultValue = null) {
    if(typeof(data) == 'string') {
      let file = path.resolve(data);
      try {
        if(fs.existsSync(file) || fs.existsSync(file + '.js') || fs.existsSync(file + '.json')) {
          return require(file);
        } else {
          return data || defaultValue;
        }
      } catch(error) {
        Log.warning({ 'message': `Error requiring module \"${file}\"`, 'class': Entity.name });
      }
    } else {
      return data || defaultValue;
    }
  }

  /** Method merge
    *
    * Merges the loaded data; existing properties will be preserved
    *
    * @param {string||object} data - either a file name or the value to be merged
    **/
  merge(data) {
    data = Entity.load(data);
    if(typeof(data) == 'object') {
      for(const [property, value] of Object.entries(data)) {
        this.set(property, value);
      }
    }
  }

  /** Method reset
    *
    * Removes a property
    *
    * @param {string} property
    **/
  reset(property) {
    delete this._param[property];
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
        if(this._param.hasOwnProperty(item)) result[item] = this.get(item);
      }
      return result;
    } else if(typeof(property) == 'string') {
      return this.select([property]);
    } else {
      return this._param;
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
    this._param[property] = value || defaultValue;
  }

  /** Method toJSON
    *
    * Returns the properties
    *
    * @return {object}
    **/
  toJSON() {
    return this._param;
  }

  /** Method toString
    *
    * Returns the properties as a stringified JSON object
    *
    * @return {string}
    **/
  toString() {
    return JSON.stringify(this._param);
  }

  /** Method valueOf
    *
    * Returns the properties
    *
    * @return {object}
    **/
  valueOf() {
    return this._param;
  }
}
