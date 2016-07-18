var controllers = angular.module('controllers', ['services', 'directives']);
controllers.controller('loginController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state) {
  $scope.self = $scope;
  if (userHttp.isLogin()) {
    $state.go('main');
    return;
  }

  $scope.login = function() {
    "use strict";
    userHttp.login({
      username: $scope.username,
      password: $scope.password
    }, function(data) {
      userHttp.user = data.user;
      location.href = '/';
    }, function() {
      $scope.error_msg = '验证错误';
    });
  };
}]);

controllers.controller('navController', ['$scope', 'userHttp','$uibModal', function($scope, userHttp, $uibModal) {
  $scope.open_update_password_modal = function () {
    var update_password_modal = $uibModal.open({
      templateUrl: 'templates/update_password.html',
      controller: 'updatePasswordController',
      size: 'sm'
    });
    update_password_modal.result.then(function() {
    });
  }
}]);

controllers.controller('updatePasswordController', ['$scope','userHttp', '$uibModalInstance',function($scope, userHttp,$uibModalInstance) {
  userHttp.getUser(function (current_user) {
    $scope.current_user = current_user;
  });
  $scope.save = function (current_user) {
    if(current_user.new_password === current_user.new_password_again){
      userHttp.update_password({user: current_user},function(data) {
        if(data.result.result){
          $uibModalInstance.close();
        }else{
          $scope.pwd_error = true;
        }
      });
    }else{
      $scope.isError = true;
    }
  }
}]);

controllers.controller('mainController', ['$scope',function($scope) {

}]);



controllers.controller('visitRecordsController', ['$scope', 'visitRecordsHttp','citiesHttp', function($scope, visitRecordsHttp,citiesHttp) {
  visitRecordsHttp.getVisitRecords({},function (data) {
    $scope.visit_records = data.result.visit_records;
    $scope.current_page = data.result.current_page;
    $scope.total_count = data.result.total_count;
  });
  citiesHttp.getOpenedCities({},function(data) {
    $scope.opened_cities = data.cities;
  });
  $scope.search = function() {
    visitRecordsHttp.getVisitRecords({
      city_id: $scope.city_id,
      agent_name: $scope.agent_name,
      doctor_name: $scope.doctor_name
    }, function(data) {
      $scope.current_page = data.result.current_page;
      $scope.total_count = data.result.total_count;
      $scope.visit_records = data.result.visit_records;
    });
  };
  $scope.pageChanged = function() {
     visitRecordsHttp.getVisitRecords({
       page: $scope.current_page
     }, function(data) {
       $scope.current_page = data.result.current_page;
       $scope.total_count = data.result.total_count;
       $scope.visit_records = data.result.visit_records;
     });
   };
   $scope.setPage = function() {
     $scope.current_page = $('#go_page').val();
     $scope.pageChanged();
     $('#go_page').val("");
   };
   $scope.refresh = function () {
      $scope.agent_name = "";
      $scope.doctor_name = "";
      $scope.city_id = "";
      visitRecordsHttp.getVisitRecords({},function (data) {
        $scope.visit_records = data.result.visit_records;
        $scope.current_page = data.result.current_page;
        $scope.total_count = data.result.total_count;
      });
      citiesHttp.getOpenedCities({},function(data) {
        $scope.opened_cities = data.cities;
      });
   }
}]);
