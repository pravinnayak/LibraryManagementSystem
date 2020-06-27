(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService)
    // .factory("UserUpdateService",UserUpdateService)

  ArticlesService.$inject = ['$resource', '$log'];

  UserUpdateService.$inject = ['$resource', '$log'];
  

  function UserUpdateService($resource, $log){
    var user = $resource('/api/users/addMinutes', {
    }, {
      update: {
        method: 'POST'
      }
    });
  }

  function ArticlesService($resource, $log) {
    var Article = $resource('/api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    return Article;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
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
