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
  _data = {};
  _metadata = {};
  _id;
  _name;
  _path;
  #caller;
  #class;

  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {int|string} id - should be converted to either _id, _name, or _path
    * @param {string||object} data - defaults to empty object
    **/
  constructor(id, data = {}) {
    this.#class = this.__proto__.constructor.name;
    if(typeof(id) == 'object') {
      // Suppose the id is not supplied and use as being data
      this._data = Entity.load(id);
    } else {
      if(typeof(id) == 'string') {
        if(id.substr(0, 1) == '/') {
          // Path supplied: store as _path and load data from path
          this._path = id;
          this._data = Entity.load(id);
        } else if(id === parseInt(id, 10)) {
          // Integer supplied: store as _id and load data
          this._id = id;
          this._data = Entity.load(data);
        } else {
          // String supplied: store as _name and load data
          this._name = id;
          this._data = Entity.load(data);
        }
      } else {
        // Int supplied: store as _id and load data
        this._id = id;
        this._data = Entity.load(data);
      }
    }
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

  /** Getter _id
    *
    * Returns the object id
    *
    * @return {int}
    **/
  get _id() {
    return this.get('_id');
  }

  /** Getter _name
    *
    * Returns the object name
    *
    * @return {string}
    **/
  get _name() {
    return this.get('_name');
  }

  /** Getter _path
    *
    * Returns the object path
    *
    * @return {string}
    **/
  get _path() {
    return this.get('_path');
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
    return this._data[property] || defaultValue;
  }

  /** Static Method load
    *
    * Loads data from a file, or assigns the value specified
    *
    * @param {string||object} data - either a file name or the value to be assigned
    * @param {string} defaultValue - returned value if property does not exist
    * @return {string||object}
    **/
  static load(data = {}, defaultValue = null) {
    if(typeof(data) == 'string') {
      let file = path.join(__base, data);
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
    delete this._data[property];
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
        if(this._data.hasOwnProperty(item)) result[item] = this.get(item);
      }
      return result;
    } else if(typeof(property) == 'string') {
      return this.select([property]);
    } else {
      return this._data;
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
    this._data[property] = value || defaultValue;
  }

  /** Method toJSON
    *
    * Returns the properties
    *
    * @return {object}
    **/
  toJSON() {
    return this._data;
  }

  /** Method toString
    *
    * Returns the properties as a stringified JSON object
    *
    * @return {string}
    **/
  toString() {
    return JSON.stringify(this._data);
  }

  /** Method valueOf
    *
    * Returns the properties
    *
    * @return {object}
    **/
  valueOf() {
    return this._data;
  }
}
