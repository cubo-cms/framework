/** @package        @cubo-cms/framework
  * @version        0.0.16
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
  constructor(data) {
    super(data);
    this.start(data);
  }
  /** @function requestHandler(request,response)
    *
    * Function requestHandler - Handles incoming requests and passes these to the processor
    *
    * @param {object} request
    * @param {object} response
    **/
  requestHandler(request, response) {
    let requestProcessor = _app_.process;
    let payload = [];
    request.on('data', (chunk) => {
      payload.push(chunk);
    }).on('end', () => {
      payload = Buffer.concat(payload).toString();
      requestProcessor({ headers: request.headers, method: request.method, url: request.url, payload: payload })
        .then((answer) => {
          console.log(answer);
          response.statusCode = answer.statusCode ? answer.statusCode : answer.ok ? 200 : 400;
          response.setHeader('Content-Type', answer.contentType || 'text/plain');
          response.setHeader('Content-Length', Buffer.byteLength(answer.output || ''));
          response.setHeader('X-Powered-By', 'Cubo CMS');
          response.setHeader('Set-Cookie', answer.cookie);
          response.write(answer.output || '');
          response.end();
        }).catch((error) => {
          console.debug(error);
          response.statusCode = 500;
          response.write(error);
          response.end();
        });
    }).on('error', (error) => {
      console.error(error);
      response.statusCode = 500;
      response.write(error);
      response.end();
    });
  }
  /** @function start(requestProcessor,data)
    *
    * Function start - Starts the server listening for requests
    *
    * @param {function} requestProcessor - function that processes request
    * @param {object} data
    **/
  start(data = null) {
    data = Core.load(data || Server.default.server);
    data.cert = data.cert.includes('BEGIN') ? data.cert : Core.loadFile(data.cert);
    data.key = data.key.includes('BEGIN') ? data.key : Core.loadFile(data.key);
    this.server = http2
      .createSecureServer(data, this.requestHandler)
      .listen(data.port, () => {
        Log.success({ message: `Server starts listening on port ${data.port}`, type: 'success' });
      });
  }
}
