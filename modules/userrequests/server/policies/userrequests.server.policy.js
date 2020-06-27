'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Userrequests Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/userrequests',
      permissions: '*'
    }, {
      resources: '/api/userrequests/:userrequestId',
      permissions: '*'
    },{
      resources:"/api/allUserrequests",
      permissions:"*"
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/userrequests',
      permissions: ['get', 'post']
    },{
      resources: '/api/manage/user/request',
      permissions: ['get']
    },{
      resources: '/api/userrequests/:userrequestId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/userrequests',
      permissions: ['get']
    }, {
      resources: '/api/userrequests/:userrequestId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Userrequests Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Userrequest is being processed and the current user created it then allow any manipulation
  if (req.userrequest && req.user && req.userrequest.user && req.userrequest.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
