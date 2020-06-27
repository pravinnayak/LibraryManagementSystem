(function () {
  'use strict';

  angular
    .module('userrequests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userrequests', {
        abstract: true,
        url: '/userrequests',
        template: '<ui-view/>'
      })
      .state('admin.userrequests', {
        abstract: true,
        url: '/userrequests',
        template: '<ui-view/>'
      })
      .state('admin.userrequests.list', {
        url: '',
        templateUrl: '/modules/userrequests/client/views/admin/userrequests-list-admin.client.view.html',
        controller: 'UserRequestAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.userrequests.allRequest', {
        url: '/allRequest',
        templateUrl: '/modules/userrequests/client/views/admin/allUserRequest-admin.client.view.html',
        // template:"<h1>Works</h1>",
        controller: 'AllUserRequestController',
        controllerAs: 'vm',
        data: {
          // roles: [],

        }
      })
      .state('admin.userrequests.create', {
        url: '/create',
        templateUrl: '/modules/userrequests/client/views/admin/form-userrequest.client.view.html',
        controller: 'UserrequestsAdminController',
        controllerAs: 'vm',
        resolve: {
          userrequestResolve: newUserrequest
        },
        data: {
          roles: ['admin'],
          
        }
      })
      .state('userrequests.list', {
        url: '',
        templateUrl: 'modules/userrequests/client/views/list-userrequests.client.view.html',
        controller: 'UserrequestsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userrequests List',
          roles:["user"]
        }
      })
      .state('userrequests.create', {
        url: '/create',
        templateUrl: 'modules/userrequests/client/views/form-userrequest.client.view.html',
        controller: 'UserrequestsController',
        controllerAs: 'vm',
        resolve: {
          userrequestResolve: newUserrequest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userrequests Create'
        }
      })
      .state('userrequests.edit', {
        url: '/:userrequestId/edit',
        templateUrl: 'modules/userrequests/client/views/form-userrequest.client.view.html',
        controller: 'UserrequestsController',
        controllerAs: 'vm',
        resolve: {
          userrequestResolve: getUserrequest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userrequest {{ userrequestResolve.name }}'
        }
      })
      //admin.userrequests.allRequest
     
      .state('userrequests.view', {
        url: '',
        templateUrl: 'modules/userrequests/client/views/view-userrequest.client.view.html',
        controller: 'UserrequestsController',
        controllerAs: 'vm',
        // resolve: {
        //   userrequestResolve: getUserrequest
        // },
        data: {
          roles:["user"],
          pageTitle: 'Userrequest {{ userrequestResolve.name }}'
        }
      });
  }

  getUserrequest.$inject = ['$stateParams', 'UserrequestsService'];

  function getUserrequest($stateParams, UserrequestsService) {
    return UserrequestsService.get({
      userrequestId: $stateParams.userrequestId
    }).$promise;
  }

  newUserrequest.$inject = ['UserrequestsService'];

  function newUserrequest(UserrequestsService) {
    return new UserrequestsService();
  }


  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
}());
