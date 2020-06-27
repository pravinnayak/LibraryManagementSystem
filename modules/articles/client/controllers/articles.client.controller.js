(function () {
    'use strict';

    angular
      .module('articles')
      .controller('ArticlesController', ArticlesController)



    ArticlesController.$inject = ['$scope', 'articleResolve', 'Authentication', "$rootScope", "$http",'$window',"$state"];

    function ArticlesController($scope, article, Authentication, $rootScope, $http,$window,$state) {
      var vm = this;
      vm.authentication = Authentication;
      vm.article = article;
      vm.authentication = Authentication;
      vm.dayToSeconds = 86400
      vm.minutesToSeconds = 60;
      vm.hrsToSeconds = 3600;
      $scope.timerRunning = true;
      vm.currDate = new Date();
      vm.memberShipEnd = new Date(vm.authentication.user.totalFreeMemberShipEnds)
      vm.display = (vm.currDate < vm.memberShipEnd)
      // vm.UserUpdateService = UserUpdateService
      vm.remaingSec = vm.authentication.user.totalFreeSeconds;
      // console.log(vm.remaingSec)

      vm.postUser = function (remaingSec) {
        var req = {
          method: 'POST',
          url: '/api/users/addMinutes',
          headers: {
            'Content-Type': undefined
          },
          data: {
            remaingSec: remaingSec
          }
        }
        $http.post(req.url, req.data).then(function (res) {
          $window.user.totalFreeSeconds = vm.remaingSec
          // console.log(vm.authentication.user)
        })
        // Authentication.auth().$promise.then((user)=>{
        //   console.log(user)
        // })
        if(remaingSec<=0){
          $window.location.reload()
        }
      }

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      // do something
      if (fromState.name == "articles.view") {
        //do a service call
        // console.log(vm.remaingSec)
        vm.postUser(vm.remaingSec);
        // $state.reload()
      }

    })

  $scope.startTimer = function () {
    // console.log("timer start")
    $scope.$broadcast('timer-resume');
    $scope.timerRunning = true;
  };


  window.onfocus = function () {
    $scope.startTimer()
  }; window.onblur = function () {
    $scope.stopTimer()
  }; //stop heartbeat
  let counter = 0;
  $scope.$on("timer-tick", function (data) {
    $scope.days = data.targetScope.days
    $scope.hours = data.targetScope.hours
    $scope.seconds = data.targetScope.seconds
    $scope.minutes = data.targetScope.minutes
    vm.remaingSec = vm.remaingSec - 1;
    counter+=1
    // console.log(vm.remaingSec)
    if(counter>10){
      vm.postUser(vm.remaingSec)
      counter = 0
    }
    if (vm.remaingSec <= 0) {
      // do an update to db
      // console.log(vm.remaingSec)
      vm.postUser(0)
      // $window.location.reload()
      // console.log(Authentication.user)

    }
    // console.log(data)
    // setTimeout(()=>{debugger},2000)
  });

  


   $scope.stopTimer = function () {
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = true;
  };

}
}());
