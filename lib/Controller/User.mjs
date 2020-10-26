/** @package        @cubo-cms/framework
  * @version        0.0.19
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
    let payload = controller.get('payload');
    if(payload && payload.id && payload.password) {
      // Id and password supplied; check if correct
      let model = controller.model({ method: 'get', dataType: 'User', id: payload.id, show: 'id,password,userRole', hide: '_id' });
      let result = await model.invokeMethod();
      let authorized = await verify(payload.password, result.data.password);
      if(authorized) {
        controller.session = new Session();
        controller.session.accessToken = Session.generateKey(32);
        controller.session.set('user', result.data.id);
        controller.session.set('userRole', result.data.userRole);
        controller.application.session[controller.session.sessionId] = controller.session;
        return { ok: true, data: JSON.stringify({ sessionId: controller.session.sessionId, accessToken: controller.session.accessToken }) + '\n', status: 'accepted' };
      } else {
        return { ok: false, data: '', type: 'warning', status: 'unauthorized' };
      }
    } else {
      return { ok: false, data: '', type: 'warning', status: 'unauthorized' };
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
