/** @package        @cubo-cms/framework
  * @version        0.0.9
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/controller
  * @description    Controller Framework
  **/
'use strict'

// TODO: add standard methods

/** @class          Controller
  *
  * Main controller class for the framework
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Controller extends Entity {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = { }) {
    super(data);
  }

  /** Getter controller
    *
    * Returns the name of the object for this controller
    *
    * @return {string}
    **/
  get controller() {
    return this.className.substring(0, this.className.length - super.className.length);
  }
}
