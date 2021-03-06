/** @package        @cubo-cms/framework
  * @version        0.0.18
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         UserController
  * @description    UserController class - controller for User objects
  **/

import crypto from 'crypto';

import Controller from '../Core/Controller.mjs';

async function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      resolve(salt + ":" + derivedKey.toString('hex'));
    });
  });
}

async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  });
}

const methods = {
  authenticate: async function(controller) {
    if(controller.get('id') && controller.get('password')) {
      // Id and password supplied; check if correct
      let data = controller['@data'];
      data.show = '[id,password,userRole]';
      data.hide = '[_id]';
      data.method = 'get';
      let model = controller.model(data);
      let result = await model.invokeMethod();
      let hash = result.password;
      let authorized = await verify(controller.get('password'), hash);
      if(authorized) {
        let session = new Session();
        console.log(session);
        session.accessToken = Session.generateKey(32);
        session.set('user', result.id);
        session.set('userRole', result.userRole);
        _app_.session[session.sessionId] = session;
        console.log(_app_.session);
        return { ok: true, message: 'Successfully logged in', sessionId: session.sessionId, accessToken: session.accessToken, data: { sessionId: session.sessionId, accessToken: session.accessToken } };
      } else {
        return { ok: false, statusCode: 401, message: 'Incorrect user name or password' };
      }
    } else {
      return { result: false, statusCode: 401, message: 'Cannot find user' };
    }
  }
}

/** @module UserController
  *
  * UserController class - controller for User objects
  **/
export default class UserController extends Controller {
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super(data);
    Object.assign(this.method, methods);
    Log.info(`Started ${this.class}`);
  }
}
