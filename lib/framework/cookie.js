/** @package        @cubo-cms/framework
  * @version        0.0.9
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         lib/framework/cookie
  * @description    Cookie Object
  **/
'use strict'

/** @class          Cookie
  *
  * Class to manipulate web cookies
  *
  * @param {string||object} data - data to be loaded on construct
  **/
module.exports = class Cookie extends Entity {
  /** Class constructor
    *
    * Preloads optional data
    *
    * @param {string} data -
    **/
  constructor(data = '') {
    super();
    for(let crumb of data.split('; ')) {
      if(crumb) {
        let [property, value] = crumb.split('=', 2);
        this.set(property, value);
      }
    }
  }

  get domain() {
    return this.get('domain');
  }

  get expires() {
    return this.get('Expires');
  }

  get httpOnly() {
    return this.get('HttpOnly');
  }

  get maxAge() {
    return this.get('Max-Age');
  }

  get path() {
    return this.get('Path');
  }

  get priority() {
    return this.get('Priority');
  }

  get sameSite() {
    return this.get('SameSite');
  }

  get secure() {
    return this.get('Secure');
  }

  set domain(value) {
    this.set('domain', value);
  }

  set expires(value) {
    this.set('Expires', value);
  }

  set httpOnly(value) {
    this.get('HttpOnly', value);
  }

  set maxAge(value) {
    this.set('Max-Age');
  }

  set path(value) {
    this.set('Path', value);
  }

  set priority(value) {
    this.set('Priority');
  }

  set sameSite(value) {
    this.set('SameSite');
  }

  set secure(value) {
    this.set('Secure', value);
  }

  // Format cookie string
  // @return: string formatted cookie
  serialize() {
    let crumbs = [];
    for(let property of Object.keys(this.valueOf())) {
      crumbs.push(property + (this.get(property) && this.get(property) !== true ? '=' + this.get(property) : ''));
    }
    return crumbs.join('; ');
  }
}
