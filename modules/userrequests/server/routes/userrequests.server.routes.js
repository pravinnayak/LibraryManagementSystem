'use strict';

/**
 * Module dependencies
 */
var userrequestsPolicy = require('../policies/userrequests.server.policy'),
  userrequests = require('../controllers/userrequests.server.controller');

module.exports = function (app) {
  // Userrequests Routes
  app.route('/api/manage/user/request').all(userrequestsPolicy.isAllowed)
    .get(userrequests.manageUserRequest);
  app.route('/api/userrequests').all(userrequestsPolicy.isAllowed)
    .get(userrequests.list)
    .post(userrequests.create);
  app.route('/api/allUserrequests').all(userrequestsPolicy.isAllowed)
  .get(userrequests.allRequest)

  app.route('/api/userrequests/:userrequestId').all(userrequestsPolicy.isAllowed)
    .get(userrequests.read)
    .put(userrequests.update)
    .post(userrequests.resolveUserRequest)
    .delete(userrequests.delete);

  // Finish by binding the Userrequest middleware
  app.param('userrequestId', userrequests.userrequestByID);
};
