/** @package        @cubo-cms/framework
  * @version        0.0.6
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/log
  * @description    Log Framework
  **/
const moduleName = 'framework';

// Define colours for different types of messages
const logLevels = {
  'debug': { 'colour': "\x1b[35m" },   // Magenta
  'error': { 'colour': "\x1b[31m" },  // Red
  'reset': { 'colour': "\x1b[0m" },   // Reset to normal
  'success': { 'colour': "\x1b[32m" }, // Green
  'warning': { 'colour': "\x1b[33m" }  // Yellow
};

// Prototype method to capitalise the first letter in a string
String.prototype.toCapitalised = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Helper to convert a message to an object with all the expected properties
function normalise(message, defaultType = 'debug') {
  if(typeof(message) == 'object') {
    if(typeof(message.type) == 'undefined') message.type = defaultType;
    if(typeof(message.module) == 'undefined') message.module = 'unknown';
    if(typeof(message.target) == 'undefined') message.target = 'console';
  } else {
    message = {
      'type': defaultType,
      'module': 'unknown',
      'target': 'console',
      'message': message
    }
  }
  // Add current time stamp
  message.time = new Date().getTime();
  return message;
}

// Helper to format the message
function output(message, defaultType = 'debug', colourise = true) {
  message = normalise(message, defaultType);
  let result =
    new Date(message.time).toISOString() + ' - ' +
    (colourise ? logLevels[message.type].colour : '') + message.type.toCapitalised() + (colourise ? logLevels['reset'].colour : '') + ': ' +
    message.message +
    (message.module == 'unknown' ? '' : ' [@cubo-cms/' + message.module + (typeof(message.user) == 'undefined' ? '' : ':' + message.user) + ']');
  return result;
}

module.exports = class Log {
  defaultLogLevel = 'error'; // Log only errors
  defaultTarget = 'console'; // Defaults to output on console

  // Initialise log
  // @param param: log parameters
  constructor(param = { }) {
    this.init(param);
  }

  // Load log data
  // @param param: log data
  // @return: parameters
  init(param) {
    this.param = new Cubo.Param(param);
    // Preset log level
    this.param.preset('logLevel', this.defaultLogLevel);
    // Preset output target
    this.param.preset('logLevel', this.defaultTarget);
  }

  // Send debug message to log
  // @param message: string or object containing the message
  debug(message) {
    if(this.param.get('logLevel').includes('debug'))
      console.warn(output(message, 'debug'));
  }

  // Send error message to log
  // @param message: string or object containing the message
  error(message) {
    if(this.param.get('logLevel').includes('error'))
      console.error(output(message, 'error'));
  }

  // Alias to send success message to log
  // @param message: string or object containing the message
  info(message) {
    this.success(message);
  }

  // Alias to send success message to log
  // @param message: string or object containing the message
  information(message) {
    this.success(message);
  }

  // Send success message to log
  // @param message: string or object containing the message
  success(message) {
    if(this.param.get('logLevel').includes('success'))
      console.log(output(message, 'success'));
  }

  // Alias to send debug message to log
  // @param message: string or object containing the message
  verbose(message) {
    this.debug(message);
  }

  // Alias to send warning message to log
  // @param message: string or object containing the message
  warn(message) {
    this.warning(message);
  }

  // Send warning message to log
  // @param message: string or object containing the message
  warning(message) {
    if(this.param.get('logLevel').includes('warning'))
      console.warn(output(message, 'warning'));
  }
}
