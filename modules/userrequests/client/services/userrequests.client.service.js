// Userrequests service used to communicate Userrequests REST endpoints
// (function () {
//   'use strict';

  

//   UserrequestsService.$inject = ['$resource'];

//   function UserrequestsService($resource) {
//     return $resource('api/userrequests/:userrequestId', {
//       userrequestId: '@_id'
//     }, {
//       update: {
//         method: 'PUT'
//       }
//     });
//   }
// }());
(function () {
  'use strict';
  angular
    .module('userrequests')
    .factory('UserrequestsService', UserrequestsService);

  function UserrequestsService($resource, $log) {
    var UserRequest = $resource('/api/userrequests/:userrequestId', {
      userrequestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(UserRequest.prototype, {
      createOrUpdate: function () {
        var userrequest = this;
        return createOrUpdate(userrequest);
      }
    });

    return UserRequest;

    function createOrUpdate(userrequest) {
      if (userrequest._id) {
        return userrequest.$update(onSuccess, onError);
      } else {
        return userrequest.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(userrequest) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
