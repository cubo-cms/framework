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
  constructor(data = {}) {
    data = data || { sessionId: Session.generateKey() };
    super(data);
    this.set('user', Session.default.user);
    this.set('userRole', Session.default.userRole);
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
