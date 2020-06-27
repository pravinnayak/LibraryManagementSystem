(function () {
  'use strict';

  angular
    .module('userrequests.admin')
    .controller('UserRequestAdminListController', UserRequestAdminListController);

  UserRequestAdminListController.$inject = ['UserrequestsService', "$http", "$scope"];

  function UserRequestAdminListController(UserrequestsService, $http, $scope) {
    var vm = this;
    vm.deleteRequestArray = [];
    // console.log("controller loaded")

    vm.deleteRequest = (article) => {
      // console.log(vm.deleteRequestArray)
      // debugger
      if (!vm.deleteRequestArray.includes(article._id)) {
        // console.log(request)
        // article.issueStatus = "Rejected"
        var url = "/api/userrequests/" + article._id
        let copy = JSON.parse(JSON.stringify(article))

        copy.issueStatus = "Rejected"
        $http.put(url, copy).then((res) => {
          vm.callUpdatedList()
        }).catch((err) => {
          // console.log(err)
        })


      }

    }
    vm.radioTick = {

    }
    vm.statusChange = (request) => {
      vm.radioTick[request._id] = "Requested"
    }
    vm.updateRequest = (article) => {
      article.issueStatus = article.issueStatus == "A" ? "Approved" : "Rejected"
      var url = "/api/userrequests/" + article._id
      $http.put(url, article).then((res) => {
        vm.callUpdatedList()
        // UserrequestsService.query().$promise.then((sucess) => {
        //   // vm.userrequests = sucess
        //   $scope.userrequests = JSON.parse(JSON.stringify(sucess))
        //   let tempArray = []
        //   for (let i of $scope.userrequests) {
        //     if (i.issueStatus == "Requested") {
        //       tempArray.push(i)
        //     }
        //   }
        //   $scope.userrequests = tempArray
        // })
      }).catch((err) => {
        // console.log(err)
      })

    }
   vm.callUpdatedList= function() {
    UserrequestsService.query().$promise.then((sucess) => {
      // vm.userrequests = sucess
      vm.userrequests = JSON.parse(JSON.stringify(sucess))
      for (let i of vm.userrequests) {
        vm.checkIssueType(i)

      }
      // let tempArray = []
      // for (let i of $scope.userrequests) {
      //   if (i.issueStatus == "Requested") {
      //     tempArray.push(i)
      //   }
      // }
      // $scope.userrequests = tempArray
    })
    }
 vm.callUpdatedList()

    vm.checkIssueType = (request) => {

      // console.log(request)

      if (request.issueType.includes("between")) {
        let currTime = new Date().getHours()
        let limit = 17;
        if (currTime >= limit) {
          vm.deleteRequest(request)
          // return false
        } else {
          // return true
        }
      } else {
        let currTime = new Date()
        let limitIfApproved = new Date(new Date().setDate(new Date(request.created).getDate() + 7))
        if (limitIfApproved > currTime) {
          // return true
        } else {
          vm.deleteRequest(request)
          // return false
        }
        // let tillDate = request.

      }

    }


  }
}());
