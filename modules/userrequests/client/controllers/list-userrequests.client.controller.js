(function () {
  'use strict';

  angular
    .module('userrequests')
    .controller('UserrequestsListController', UserrequestsListController);

  UserrequestsListController.$inject = ['UserrequestsService',"$http","$state","$rootScope","ArticlesService"];

  function UserrequestsListController(UserrequestsService,$http,$state,$rootScope,ArticlesService) {
    var vm = this;

    // vm.userrequests = UserrequestsService.query();
    $http.get("/api/manage/user/request").then((res)=>{
      vm.userrequests = res.data
    })

    vm.takeToPage=(book)=>{
      $rootScope.userrequest={}
      $rootScope.userrequest.selectedObj = book
      $state.go("userrequests.view")

    }

    vm.updateBook = (request) => {
      // //console.log(request)
      ArticlesService.update({
        articleId: request.bookId._id
      }, {
        title: request.bookId.title,
        content: request.bookId.content,
        issued: false,
        issuedTill: null
      }).$promise.then(() => {
        let url = "/api/userrequests/" + request._id
        let data = {
          issueStatus: "Resolved"
        }
        $http.post(url, data).then(function (success) {
          //console.log(success)
          $state.reload()
          // $http.get("/api/manage/user/request").then((res)=>{
          //   vm.userrequests = res.data
          // })
        })

      })
    }

    
  }
}());
