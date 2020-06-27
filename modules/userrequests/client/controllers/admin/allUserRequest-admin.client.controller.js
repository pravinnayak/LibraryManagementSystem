(function () {
    'use strict';
  
    // Userrequests controller
    angular
      .module('userrequests')
      .controller('AllUserRequestController', AllUserRequestController);
  
      AllUserRequestController.$inject = ['$scope', '$state', '$window', 'Authentication', "$rootScope", "$http", "$interval", "ArticlesService"];
  
    function AllUserRequestController($scope, $state, $window, Authentication, $rootScope, $http, $interval, ArticlesService) {
      var vm = this;
        vm.userrequests = []
        let url = "/api/allUserrequests"
        $http.get(url).then((succ)=>{
            vm.userrequests = succ.data
            console.log(vm.userrequests)
        })
    }
  }());
  