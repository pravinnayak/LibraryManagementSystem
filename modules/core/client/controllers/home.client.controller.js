(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];
  function HomeController($scope,$state,Authentication,menuService) {
    var vm = this;
    vm.authentication = Authentication;
    
    function secondsToHms(d) {
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);
  
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "0 minute, ";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "0 seconds ";
      return hDisplay + mDisplay + sDisplay; 
  }
  if(vm.authentication.user){
    vm.totalFreeSeconds = secondsToHms(vm.authentication.user.totalFreeSeconds)
    // console.log(vm.totalFreeSeconds)

  }
  }
}());
