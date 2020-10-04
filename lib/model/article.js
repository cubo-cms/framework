/** @package        @cubo-cms/model
  * @version        0.0.1
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/model/article
  * @description    Article Model
  **/
'use strict'

const methods = {
}

/** @class          Article
  *
  * Model for article objects
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class Article extends Model {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(name, data = { }) {
    super(name, data);
    Object.assign(this.method, methods);
    //console.log(this);
    Log.debug('Started Article Model');
  }
}

module.exports = Article;