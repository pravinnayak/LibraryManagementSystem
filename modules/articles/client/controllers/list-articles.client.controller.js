(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);


  

  ArticlesListController.$inject = ['ArticlesService','$injector',"$state","$scope","$rootScope","$window","articleResolve","Authentication","$http"];

  function ArticlesListController(ArticlesService,$injector,$state,$scope,$rootScope,$window,articleResolve,Authentication,$http) {
    var vm = this;
    vm.issueStart = "10:00:00 AM"
    vm.issueEnd = "5:00:00 PM"
    vm.issueArticle;
    vm.article = articleResolve
    vm.user = Authentication.user;
    vm.memberShipEnds = new Date(vm.user.totalFreeMemberShipEnds)
    vm.currDate = new Date();
    vm.display = (vm.currDate < vm.memberShipEnds)
      // vm.memberShipEnd = new Date(vm.authentication.user.totalFreeMemberShipEnds)
    vm.checkOptions = ()=>{
      let curr = new Date();
      if(curr<vm.memberShipEnds){
        let futureDate = new Date(new Date().setDate(curr.getDate() + 5))
        
        if(futureDate >= vm.memberShipEnds){
          // console.log(futureDate.toDateString())
          vm.options = ["between 10am to 5pm"]
          if(new Date().getHours()>15){
            vm.options=[];
          }
        }else{
          vm.options = ["between 10am to 5pm","For 7 days"]
          // console.log(new Date().getHours())
          if(new Date().getHours()>=15){
            vm.selecteOption = "For 7 days"
            vm.options=["For 7 days"];
          }
        }
      }else{
        // console.log("memeber ship expired")
        vm.display=false
      }
    }
    // console.log("vm called",$rootScope.issueArticle)
    vm.articles = ArticlesService.query();
    vm.selecteOption = "between 10am to 5pm"
    vm.options = ["between 10am to 5pm","For 7 days"]
    vm.checkOptions()
    // console.log(vm.user)
    vm.submitIssue=()=>{
      // /api/userrequests
      let url = "/api/userrequests"
      let data = {
        bookId:$rootScope.issueArticle._id,
        issueType:vm.selecteOption
      }
      $http.post(url,data).then((res)=>{
        var Notification = $injector.get("Notification")
        $state.go("articles.list")
        Notification.success({message:"Your request has been issued,Please wait for admin approval",dealy:10000})
      })
      // console.log(vm.selecteOption,$rootScope.issueArticle._id)
    }


    vm.dropDownChange = ()=>{
      // console.log(vm.selecteOption,$rootScope.issueArticle._id)
    }
    // vm.retrun = (article)=>{
    //   let day =  new Date().toLocaleString().split(",")[0].trim();
    //   let startDate = new Date(day+", "+vm.issueStart)
    //   let endDate = new Date(day+", "+vm.issueEnd)
    //   let curr = new Date()
    //   if(startDate<curr<endDate || true){
    //     // can return 
    //     var res= $window.confirm("you are returning "+article.title)
    //     if(res){
    //       //retun service call
    //       ArticlesService.update({articleId:article._id},{title:article.title,content:article.content,issued:false,issuedTill:null}).$promise.then(()=>{
    //         $state.reload()
    //       })
    //     }
    //   }else{
    //     var Notification = $injector.get('Notification');
    //     Notification.error({message:"You can not return book after 5pm,Please try tommorw after 10am",delay: 40000});
        
    //   }
    
     
    // }






    vm.issueDisable = (article)=>{
      // var Notification = $injector.get('Notification');
      // console.log(Notification.success)
     
      
      // console.log(vm.issueArticle)
      // Notification.error({message:"You cant issue book after 5pm,Please try tommorw after 10am",delay: 20000});
      // console.log("inside issue")
      let day =  new Date().toLocaleString().split(",")[0].trim();
      let startDate = new Date(day+", "+vm.issueStart)
      let endDate = new Date(day+", "+vm.issueEnd)
      let curr = new Date()
      // console.log(startDate,endDate,curr)
      if(startDate<curr && curr<endDate){
        //can issuse
        $rootScope.issueArticle = article
        $state.go("articles.createIssueRequest")
      }else{
        // console.log("notify")
        // $state.go("articles.createIssueRequest")
        var Notification = $injector.get('Notification');
        Notification.error({message:"You can not issue book after 5pm,Please try tommorw after 10am",delay: 20000});
        
      }
    }
  }
}());
