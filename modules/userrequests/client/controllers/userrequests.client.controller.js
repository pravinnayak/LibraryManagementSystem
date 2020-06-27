(function () {
  'use strict';

  // Userrequests controller
  angular
    .module('userrequests')
    .controller('UserrequestsController', UserrequestsController);

  UserrequestsController.$inject = ['$scope', '$state', '$window', 'Authentication', "$rootScope", "$http", "$interval", "ArticlesService"];

  function UserrequestsController($scope, $state, $window, Authentication, $rootScope, $http, $interval, ArticlesService) {
    var vm = this;

    vm.selectedObj = $rootScope.userrequest.selectedObj;
    console.log(vm.selectedObj)
    if (vm.selectedObj && vm.selectedObj.bookId._id && vm.selectedObj.issueStatus == "Approved") {
      vm.issueType = vm.selectedObj.issueType
      vm.issueStatus = vm.selectedObj.issueStatus
      vm.id = vm.selectedObj.bookId._id
      // vm.book = vm.selectedObj.bookId
      vm.getBook = () => {
        let url = "/api/articles/" + vm.id
        return $http.get(url)

      }
      vm.interval = $interval(function () {
        vm.conditionCheck()
      }, 1000 * 60)
      $scope.$on('$destroy', function () {
        $interval.cancel(vm.interval)

      });



      vm.updateBook = () => {
        ArticlesService.update({
          articleId: vm.id
        }, {
          title: vm.book.title,
          content: vm.book.content,
          issued: false,
          issuedTill: null
        }).$promise.then(() => {
          let url = "/api/userrequests/" + vm.selectedObj._id
          let data = {
            issueStatus: "Resolved"
          }
          $http.post(url, data).then(function (success) {
            // //console.log(success)
            // $state.reload()
          })

        })
      }



      vm.conditionCheck = () => {
        vm.getBook().then((res) => {
          vm.book = res.data
          if (vm.book.issued) {

            vm.tillDate = new Date(vm.book.issuedTill)
            let currDate = new Date()
            //console.log(vm.tillDate)
            if (vm.tillDate < currDate) {
              //console.log("not clear")
              $scope.checkVar = false
              vm.updateBook()
            } else {
              $scope.checkVar = true

            }
          } else {
            $scope.checkVar = false
            vm.updateBook()
          }
        })


      }
      vm.conditionCheck()





    }


    //   vm.authentication = Authentication;
    //   vm.userrequest = userrequest;
    //   vm.error = null;
    //   vm.form = {};
    //   vm.remove = remove;
    //   vm.save = save;

    //   // Remove existing Userrequest
    //   function remove() {
    //     if ($window.confirm('Are you sure you want to delete?')) {
    //       vm.userrequest.$remove($state.go('userrequests.list'));
    //     }
    //   }

    //   // Save Userrequest
    //   function save(isValid) {
    //     if (!isValid) {
    //       $scope.$broadcast('show-errors-check-validity', 'vm.form.userrequestForm');
    //       return false;
    //     }

    //     // TODO: move create/update logic to service
    //     if (vm.userrequest._id) {
    //       vm.userrequest.$update(successCallback, errorCallback);
    //     } else {
    //       vm.userrequest.$save(successCallback, errorCallback);
    //     }

    //     function successCallback(res) {
    //       $state.go('userrequests.view', {
    //         userrequestId: res._id
    //       });
    //     }

    //     function errorCallback(res) {
    //       vm.error = res.data.message;
    //     }
    //   }
  }
}());
