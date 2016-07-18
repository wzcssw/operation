var controllers = angular.module('controllers', ['services', 'directives']);
controllers.controller('loginController', ['$scope', 'userHttp', '$state', function($scope, userHttp, $state) {
  $scope.self = $scope;
  if (userHttp.isLogin()) {
    $state.go('dic_hospitals');
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



controllers.controller('addProjectToHospitalController', ['$scope', 'projectHttp', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function($scope, projectHttp, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.items = items;
  hospitalHttp.getHospitalProjects({
    hospital_id: items.hospital_id
  }, function(data) {
    var project_name_arr = [];
    for (var i = 0; i < data.projects.length; i++) {
      project_name_arr.push(data.projects[i].project);
    }
    $scope.items.project_name_arr = project_name_arr;
  });
  projectHttp.getProjects({
    category_id: items.category_id
  }, function(data) {
    $scope.projects = data.result.projects;
  });
  $scope.contains = function(arr, obj, _this) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function() {
    project_ids = [];
    angular.forEach($scope.projects, function(object, index) {
      if (object.isChecked) {
        project_ids.push(object.id)
      }
    });
    hospitalHttp.addHospitalProjects({
      hospital_id: items.hospital_id,
      project_ids: project_ids
    }, function(data) {
      $uibModalInstance.close();
      $state.reload();
    });
  };
}]);


controllers.controller('feedbacksController', ['$scope', 'feedbacksHttp', function($scope, feedbacksHttp) {
  $scope.self = $scope;
  $scope.current_page = 1;
  $scope.maxSize = 5;
  feedbacksHttp.getClassify({},function(data){
    $scope.classifies = data.classifies;
  });
  $scope.getFeedback = function(){
    feedbacksHttp.getFeedbacks({
      q: $scope.q,
      classify: $scope.classify,
      page: $scope.current_page
    },function(data){
      $scope.feedbacks = data.feedbacks;
      $scope.current_page = data.current_page;
      $scope.total_count = data.total_count;
    });
  };
  $scope.getFeedback();
  $scope.setPage = function() {
    $scope.current_page = $('#go_page').val();
    $scope.getFeedback();
    $('#go_page').val("");
  }
}]);
