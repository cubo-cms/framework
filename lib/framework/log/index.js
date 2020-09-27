/** @package        @cubo-cms/framework
  * @version        0.0.4
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         framework/lib/framework/log
  * @description    Log Framework
  **/
'use strict'
const moduleName = 'framework';

String.prototype.toCapitalised = function (str) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = class Log {
  defaultLogLevel = 'error'; // Log only errors

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
    console.log(this.param);
    // Preset log level
    this.param.preset('logLevel', this.defaultLogLevel);
  }

  debug(message) {
    if(this.param.get('logLevel').includes('debug'))
      console.warn(output(message));
  }

  error(message) {
    if(this.param.get('logLevel').includes('error'))
      console.error(output(message));
  }

  info(message) {
    this.information(output(message));
  }

  information(message) {
    if(this.param.get('logLevel').includes('information'))
      console.log(output(message));
  }

  verbose(message) {
    this.information(output(message));
  }

  warn(message) {
    this.warning(message);
  }

  warning(message) {
    if(this.param.get('logLevel').includes('warning'))
      console.warn(output(message));
  }
}

function normalise(message) {
  if(typeof(message) == 'object') {
    if(typeof(message.type) == 'undefined') message.type = 'debug';
    if(typeof(message.module) == 'undefined') message.module = 'unknown';
    if(typeof(message.target) == 'undefined') message.target = 'console';
  } else {
    message = {
      'type': 'debug',
      'module': 'unknown',
      'target': 'console',
      'message': message
    }
  }
  // Add current time stamp
  message.time = new Date().getTime();
  return message;
}

function output(message) {
  message = normalise(message);
  message = new Date(message.time).toISOString() + ' ' + message.type.toCapitalised() + ': ' + message.message + (message.module == 'unknown' ? '' : ' ( in module ' + message.module + ')');
  return message;
}
