'use strict'

import Namespace from '../index.mjs';
await Namespace.autoLoad();

let app = new Application('#/example/application.json');

app.run();
