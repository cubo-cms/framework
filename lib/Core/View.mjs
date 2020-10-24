/** @package        @cubo-cms/framework
  * @version        0.0.18
  * @copyright      2020 Cubo CMS <https://cubo-cms.com/COPYRIGHT.md>
  * @license        MIT license <https://cubo-cms.com/LICENSE.md>
  * @author         Papiando <info@papiando.com>
  * @module         View
  * @description    View class - Formats data received from controller
  **/

/** @module View
  *
  * View class - Formats data received from controller
  *   NOTE: Depends on @cubo-cms/core
  **/
export default class View extends Core {
  /** @property {object} default - holds default values
    **/
  static default = {
    render: 'html'
  }
  /** @property {object} method - holds all accepted methods
    **/
  render = {
    html: async function(view) {
      view.set('ok', true);
      view.set('contentType', 'text/html; charset=utf-8');
      view.set('render', 'html');
      let style = view.get('style') || Array.isArray(view.get('data')) ? 'list' : 'document';
      let styles = view.controller.application.get('style');
      if(styles && styles[style]) {
        let template = Core.load(styles[style]);
        let renderer = new TemplateRenderer(view.data);
        view.set('data', renderer.render(template));
      } else {
        view.set('data', '<pre>' + JSON.stringify(view.get('data'), null, 2) + '</pre>');
      }
      console.log(view.data);
      return view.data;
    },
    json: async function(view) {
      view.set('ok', true);
      view.set('contentType', 'application/json; charset=utf-8');
      view.set('render', 'json');
      view.set('data', JSON.stringify(view.get('data')));
      return view.data;
    }
  }
  /** @function constructor(data)
    *
    * Class constructor - preloads optional data
    *
    * @param {object} data - passed object data
    **/
  constructor(data = {}) {
    super(data);
  }
  /** @function dataType()
    *
    * Getter function dataType - returns the dataType for this view
    *
    * @return {string}
    **/
  get dataType() {
    return this.get('dataType');
  }
  /** async @function invokeMethod(method)
    *
    * Asynchronous function invokeMethod - Invokes view method and returns processed data
    *
    * @param {string} method - method to be called
    * @return {object}
    **/
  async invokeRender() {
    let render = this.get('render') || View.default.render;
    if(render) {
      if(typeof this.render[render] === 'function') {
        Log.success(`View invokes render \"${render}\"`);
        return await this.render[render](this);
      } else {
        Log.warning(`View failed to invoke render \"${render}\"`);
      }
    } else {
      Log.warning(`View could not determine render`);
    }
  }
  /** Static @function construct(dataType,data,caller)
    *
    * Static function construct - Creates a new view with specified dataType
    *
    * @param {string} dataType
    * @param {string||object} data - to be passed on to new object
    * @param {object} caller - should contain the object that called this
    * @return {object}
    **/
  static construct(dataType = '', data = {}, caller = null) {
    let view;
    try {
      if(View.exists(dataType)) {
        view = new Namespace.loaded[dataType + this.name](data);
        Log.success(`View starts named instance`);
      } else {
        view = new View(data);
        Log.success(`View starts generic instance`);
      }
      view.caller = caller;
      return view;
    } catch(error) {
      throw new FrameworkError({ message: `View failed to start instance`, type: 'error' });
    }
  }
  /** Static @function exists(dataType)
    *
    * Static function exists - Returns true if the specified view exists
    *
    * @param {string} dataType
    * @return {bool}
    **/
  static exists(dataType = '') {
    return Namespace.isLoaded(dataType + this.name);
  }
}
