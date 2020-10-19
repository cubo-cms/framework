/** @package        @cubo-cms/framework
  * @version        0.0.17
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Session
  * @description    Session class - Handles session information
  **/

import crypto from 'crypto';

/** @module Session
  *
  * Session class - Handles session information
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Session extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    cleanUpInterval: '1d',
    keySize: 24,
    maxAge: '1h',
    user: 'nobody',
    userRole: 'guest'
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to default route
    **/
  constructor(data = undefined) {
    data = data || { sessionId: Session.generateKey() };
    super(data);
    this.set('user', Session.default.user);
    this.set('userRole', Session.default.userRole);
    Session.expire(this);
  }
  /** @function isAdministrator()
    *
    * Getter function isManager - returns true if a user is a manager
    *
    * @return {bool}
    **/
  get isAdministrator() {
    return this.isAuthenticated && ['administrator'].includes(this.get('userRole'));
  }
  /** @function isAuthenticated()
    *
    * Getter function isAuthenticated - returns true if a session appears authenticated
    *
    * @return {bool}
    **/
  get isAuthenticated() {
    return this.accessToken && this.expires > Date.now();
  }
  /** @function isAuthor()
    *
    * Getter function isAuthor - returns true if a user is an author
    *
    * @return {bool}
    **/
  get isAuthor() {
    return this.isAuthenticated && ['author','editor','publisher','manager','administrator'].includes(this.get('userRole'));
  }
  /** @function isEditor()
    *
    * Getter function isEditor - returns true if a user is an editor
    *
    * @return {bool}
    **/
  get isEditor() {
    return this.isAuthenticated && ['editor','publisher','manager','administrator'].includes(this.get('userRole'));
  }
  /** @function isGuest()
    *
    * Getter function isGuest - returns true if a user is a guest
    *
    * @return {bool}
    **/
  get isGuest() {
    return !this.isAuthenticated;
  }
  /** @function isManager()
    *
    * Getter function isManager - returns true if a user is a manager
    *
    * @return {bool}
    **/
  get isManager() {
    return this.isAuthenticated && ['manager','administrator'].includes(this.get('userRole'));
  }
  /** @function isPublisher()
    *
    * Getter function isPublisher - returns true if a user is a publisher
    *
    * @return {bool}
    **/
  get isPublisher() {
    return this.isAuthenticated && ['publisher','manager','administrator'].includes(this.get('userRole'));
  }
  /** @function user()
    *
    * Getter function user - returns currently authenticated user
    *
    * @return {string}
    **/
  get user() {
    return this.get('user');
  }
  /** @function userRole()
    *
    * Getter function userRole - returns role of currently authenticated user
    *
    * @return {bool}
    **/
  get userRole() {
    return this.get('userRole');
  }
  /** static @function cleanUp(sessions)
    *
    * Static function cleanUp - Removes sessions that are expired
    *
    * @param {object} sessions
    **/
  static cleanUp(sessions = {}) {
    Log.info('Session starts cleaning up');
    for(const session of Object.keys(sessions)) {
      if(sessions[session].expires && sessions[session].expires < Date.now()) {
        delete sessions[session];
      }
    }
  }
  /** static @function expire(session)
    *
    * Static function expire - Sets expiration time for session
    *
    * @param {object} session
    **/
  static expire(session) {
    session.expires = Date.now() + Timer.parse(Session.default.maxAge);
  }
  /** static @function generateKey(size)
    *
    * Static function generateKey - Generates a random key of specified size
    *
    * @param {int} size
    * @return {string}
    **/
  static generateKey(size = Session.default.keySize) {
    return crypto.randomBytes(size).toString('base64');
  }
}
