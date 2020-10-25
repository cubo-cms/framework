/** @package        @cubo-cms/framework
  * @version        0.0.19
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         Server
  * @description    Server class - Creates a server object and starts listening
  **/

import http2 from 'http2';

import Session from './Session.mjs';

/** @module Server
  *
  * Server class - Creates a server object and starts listening
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class Server extends Core {
  static default = {
    server: {
      key: '#/.cert/localhost-privkey.pem',
      cert: '#/.cert/localhost-cert.pem',
      port: 4000
    }
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {string||object} data - passed object data; defaults to file #/application.json
    **/
  constructor(data = Server.default.server) {
    super(data);
  }
  /** @function start(application,processor)
    *
    * Function start - Starts the server listening for requests
    *
    * @param {function} processor - function that processes request
    **/
  start(application, processor) {
    this.set('cert', this.get('cert').includes('BEGIN') ? this.get('cert') : Server.loadFile(this.get('cert')));
    this.set('key', this.get('key').includes('BEGIN') ? this.get('key') : Server.loadFile(this.get('key')));
    this.server = http2
      .createSecureServer(this.data, (request, response) => {
        let payload = [];
        request.on('data', (chunk) => {
          payload.push(chunk);
        }).on('end', () => {
          payload = Buffer.concat(payload).toString();
          processor(application, { headers: request.headers, method: request.method, url: request.url, payload: payload })
            .then((result) => {
              response.statusCode = result.status ? Core.status[result.status].code : result.ok ? 200 : 400;
              response.setHeader('Content-Type', result.contentType || 'text/plain');
              response.setHeader('X-Powered-By', 'Cubo CMS');
              response.setHeader('Set-Cookie', result.cookie);
              if(result.ok) {
                response.setHeader('Content-Length', Buffer.byteLength(result.data || ''));
                response.write(result.data || '');
              } else {
                result.data = Core.status[result.status].message || '';
                response.setHeader('Content-Length', Buffer.byteLength(result.data || ''));
                response.write(result.data || '');
              }
              response.end();
            }).catch((error) => {
              console.debug(error);
              response.statusCode = 500;
              response.write(error);
              response.end();
            });
        }).on('error', (error) => {
          console.debug(error);
          response.statusCode = 500;
          response.write(error);
          response.end();
        });
      }).listen(this.get('port'), () => {
        Log.success({ message: `Server starts listening on port ${this.get('port')}`, type: 'success', class: this.name });
      });
  }
}
