/** @package        @cubo-cms/framework
  * @version        0.0.5
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/log
  * @description    Log Framework
  **/
'use strict'
const moduleName = 'framework';

const logLevels = {
  'debug': { 'colour': "\x1b[35m" },   // Magenta
  'error': { 'colour': "\x1b[31m" },  // Red
  'reset': { 'colour': "\x1b[0m" },   // Reset to normal
  'success': { 'colour': "\x1b[32m" }, // Green
  'warning': { 'colour': "\x1b[33m" }  // Yellow
};

String.prototype.toCapitalised = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

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

function output(message, defaultType = 'debug', colourise = true) {
  message = normalise(message, defaultType);
  let result =
    new Date(message.time).toISOString() + ' - ' +
    (colourise ? logLevels[message.type].colour : '') + message.type.toCapitalised() + (colourise ? logLevels['reset'].colour : '') + ': ' +
    message.message +
    (message.module == 'unknown' ? '' : ' (in module ' + message.module + ')');
  return result;
}

module.exports = class Log {
  defaultLogLevel = 'error'; // Log only errors
  defaultTarget = 'console'; // Defaults to output on console

  // Initialise log
  // @param param: initialisation parameters
  constructor(param = { }) {
    this.init(param);
  }

  // Load initialisation parameters
  // @param param: initialisation parameters
  // @return: parameters
  init(param) {
    this.param = new Cubo.Param(param);
    // Preset log level
    this.param.preset('logLevel', this.defaultLogLevel);
    // Preset output target
    this.param.preset('logLevel', this.defaultTarget);
  }

  debug(message) {
    if(this.param.get('logLevel').includes('debug'))
      console.warn(output(message, 'debug'));
  }

  error(message) {
    if(this.param.get('logLevel').includes('error'))
      console.error(output(message, 'error'));
  }

  info(message) {
    this.success(message);
  }

  information(message) {
    this.success(message);
  }

  success(message) {
    if(this.param.get('logLevel').includes('success'))
      console.log(output(message, 'success'));
  }

  verbose(message) {
    this.information(message);
  }

  warn(message) {
    this.warning(message);
  }

  warning(message) {
    if(this.param.get('logLevel').includes('warning'))
      console.warn(output(message, 'warning'));
  }
}
