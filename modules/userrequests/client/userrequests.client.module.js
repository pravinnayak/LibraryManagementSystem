(function (app) {
  'use strict';

  app.registerModule('userrequests', ['core']);
  app.registerModule('userrequests.admin', ['core.admin']);
  app.registerModule('userrequests.admin.routes', ['core.admin.routes']);
  app.registerModule('userrequests.services');
  app.registerModule('userrequests.routes', ['ui.router', 'core.routes', 'userrequests.services']);
}(ApplicationConfiguration));
