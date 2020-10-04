/** @package        @cubo-cms/framework
  * @version        0.0.10
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/log
  * @description    Log Object
  **/

// TODO: Consider making Log extending Error
// TODO: Consider letting messages be thrown to retrieve a stack trace

// Define colors for different types of messages
const logLevels = {
  'debug': { 'color': "\x1b[35m" },   // Magenta
  'error': { 'color': "\x1b[31m" },  // Red
  'reset': { 'color': "\x1b[0m" },   // Reset to normal
  'success': { 'color': "\x1b[32m" }, // Green
  'warning': { 'color': "\x1b[33m" }  // Yellow
};

/** Function normalize
  *
  * Adds any missing properties, such as a timestamp
  *
  * @param {string||object} message
  * @param {string} defaultType
  * @return {object}
  **/
function normalize(message, defaultType = 'debug') {
  if(typeof(message) == 'object') {
    if(typeof(message.module) == 'undefined') message.module = 'unknown';
    if(typeof(message.target) == 'undefined') message.target = 'console';
    if(typeof(message.type) == 'undefined') message.type = defaultType;
  } else {
    message = {
      'class': 'unknown',
      'module': 'unknown',
      'target': 'console',
      'type': defaultType,
      'message': message
    }
  }
  // Add current time stamp
  message.time = new Date().getTime();
  return message;
}

/** Function output
  *
  * Outputs the data
  *
  * @param {string||object} message
  * @param {string} defaultType
  * @param {bool} colorize - when displaying to console the text can have nice colors
  * @return {object}
  **/
function output(message, defaultType = 'debug', colorize = true) {
  message = normalize(message, defaultType);
  let result =
    new Date(message.time).toISOString() + ' - ' +
    (colorize ? logLevels[message.type].color : '') + message.type + (colorize ? logLevels['reset'].color : '') + ': ' +
    message.message +
    (message.module == 'unknown' ? '' : ' [@cubo-cms/' + message.module + (typeof(message.user) == 'undefined' ? '' : ':' + message.user) + ']') +
    (message.class == 'unknown' ? '' : ' [' + message.class + ']');
  return result;
}

/** @class          Log
  *
  * Log class allows logging of messages; most methods are static
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Log extends Entity {
  /** Object default
    *
    * Defines default values
    **/
  _default = {
    logLevel: 'error',  // Log only errors
    target: 'console'   // Defaults to output on console
  }

  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data
    **/
  constructor(data) {
    super(data);
    // Preset log level
    this.set('logLevel', this.get('logLevel'), this._default.logLevel);
    // Preset output target
    this.set('logTarget', this.get('logTarget'), this._default.target);
  }

  /** Static Method debug
    *
    * Logs a debug message
    *
    * @param {string||object} message
    **/
  static debug(message) {
    console.warn(output(message, 'debug'));
  }

  /** Static Method error
    *
    * Logs a error message
    *
    * @param {string||object} message
    **/
  static error(message) {
    console.error(output(message, 'error'));
  }

  /** Static Method info
    *
    * Alias to success message
    *
    * @param {string||object} message
    **/
  static info(message) {
    this.success(message);
  }

  /** Static Method information
    *
    * Alias to success message
    *
    * @param {string||object} message
    **/
  static information(message) {
    this.success(message);
  }

  /** Static Method success
    *
    * Logs a success message
    *
    * @param {string||object} message
    **/
  static success(message) {
    console.log(output(message, 'success'));
  }

  /** Static Method verbose
    *
    * Alias to debug message
    *
    * @param {string||object} message
    **/
  static verbose(message) {
    this.debug(message);
  }

  /** Static Method warn
    *
    * Alias to warning message
    *
    * @param {string||object} message
    **/
  static warn(message) {
    this.warning(message);
  }

  /** Static Method warning
    *
    * Logs a warning message
    *
    * @param {string||object} message
    **/
  static warning(message) {
    console.warn(output(message, 'warning'));
  }
}
