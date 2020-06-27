(function () {
    'use strict';
  
    angular
      .module('users')
      .controller('ViewBooksHistory', ViewBooksHistory);
  
      ViewBooksHistory.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];
  
    function ViewBooksHistory($scope, $http, $location, UsersService, Authentication, Notification) {
      var vm = this;
  
    //   vm.user = Authentication.user;
    //   console.log(vm.user,"user")
      UsersService.history().$promise.then(function(data){
         vm.user = data.user
         vm.user.booksIssueHistory
      })
      vm.remove = (bookToRemove)=>{
          UsersService.removeHistory({book:bookToRemove}).$promise.then(function(data){
            UsersService.history().$promise.then(function(data){
                vm.user = data.user
                vm.user.booksIssueHistory
             })
          })
      }
    //   vm.updateUserProfile = updateUserProfile;
  
      // Update a user profile
    //   function updateUserProfile(isValid) {
  
    //     if (!isValid) {
    //       $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
  
    //       return false;
    //     }
  
    //     var user = new UsersService(vm.user);
  
    //     user.$update(function (response) {
    //       $scope.$broadcast('show-errors-reset', 'vm.userForm');
  
    //       Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
    //       Authentication.user = response;
    //     }, function (response) {
    //       Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
    //     });
    //   }
    }
  }());
  