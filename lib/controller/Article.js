/** @package        @cubo-cms/controller
  * @version        0.0.3
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/controller/article
  * @description    Article Controller
  **/
'use strict'

const methods = {
}

/** @class          ArticleController
  *
  * Controller for article objects
  *
  * @param {string||object} data - data to be loaded on construct
  **/
class ArticleController extends Controller {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string||object} data - defaults to empty
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    //console.log(this);
    Log.debug('Started Article Controller');
  }

}

module.exports = ArticleController;
