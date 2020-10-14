/** @package        @cubo-cms/framework
  * @version        0.0.14
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @description    Integrates packages by auto-registering all modules
  **/

let dirname = require('path').dirname;
let fileURLToPath = require('url').fileURLToPath;

let Namespace = require('@cubo-cms/core').default;

const basePath = dirname(fileURLToPath(import.meta.url));

Namespace.autoRegister('./lib', basePath);

module.exports = Namespace;
