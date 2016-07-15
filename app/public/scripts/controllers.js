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

controllers.controller('mainController', ['$scope', 'userHttp', function($scope, userHttp) {
  $scope.self = $scope;
  $scope.register = function() {
    "use strict";
    userHttp.register({
      username: $scope.username,
      password: $scope.password
    }, function(data) {
      var result = data.result;
    });
  }
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

controllers.controller('dicHospitalsController', ['$scope', 'dic_hospitalHttp', '$state', '$log', '$uibModal', function($scope, dic_hospitalHttp, $state, $log, $uibModal) {
  "use strict";
  $scope.self = $scope;
  $scope.maxSize = 5;
  $scope.city_id = "";
  $scope.q = "";
  $scope.hospitalEnabled = true;
  dic_hospitalHttp.getHospital({}, function(data) {
    $scope.hospitals = data.hospitals;
    $scope.current_page = data.current_page;
    $scope.total_count = data.total_count;
  });
  dic_hospitalHttp.getOptionAttr({}, function(data) {
    $scope.levels = data.levels;
    $scope.cities = data.cities;
    $scope.natures = data.natures;
    $scope.projects = data.projects;
    $scope.device_states = data.device_states;
  });
  $scope.pageChanged = function() {
    dic_hospitalHttp.getHospital({
      page: $scope.current_page,
      q: $scope.q,
      city_id: $scope.city_id
    }, function(data) {
      $scope.current_page = data.current_page;
      $scope.hospitals = data.hospitals;
    });
  };
  $scope.setPage = function() {
    $scope.current_page = $('#go_page').val();
    $scope.pageChanged();
    $('#go_page').val("");
  };
  $scope.search = function() {
    dic_hospitalHttp.getHospital({
      q: $scope.q,
      city_id: $scope.city_id
    }, function(data) {
      $scope.hospitals = data.hospitals;
      $scope.current_page = data.current_page;
      $scope.total_count = data.total_count;
    });
  }
  $scope.delete = function(id){
    dic_hospitalHttp.deleteHospital({id: id}, function(data){
      if(data.success){
        $scope.pageChanged();
      }
  })
    //打开新建框
  }
  $scope.open_new = function() {
    $scope.items = {
      levels: $scope.levels,
      cities: $scope.cities,
      natures: $scope.natures
    };
    var new_hospital = $uibModal.open({
      animation: true,
      templateUrl: 'new_hospital.html',
      controller: function($scope, $uibModalInstance, items) {
        $scope.cities = items.cities;
        $scope.levels = items.levels;
        $scope.natures = items.natures;
        $scope.is_null = false;
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function(hospital) {
          if(hospital.name==null||hospital.level==null||hospital.nature==null||hospital.city_id==null){
            $scope.is_null = true;
          }else{
            dic_hospitalHttp.createHospital({
              hospital: hospital
            }, function(data) {
              $uibModalInstance.close();
            });
          }
        };
      },
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    new_hospital.result.then(function() {
      $scope.pageChanged();
    });
  };
  //打开编辑框
  $scope.open_edit = function(hospital) {
    $scope.items = {
      hospital: hospital,
      levels: $scope.levels,
      cities: $scope.cities,
      natures: $scope.natures
    };
    var edit_hospital = $uibModal.open({
      animation: $scope.hospitalEnabled,
      templateUrl: 'edit_hospital.html',
      controller: function($scope, $uibModalInstance, items) {
        $scope.hospital = items.hospital;
        $scope.cities = items.cities;
        $scope.levels = items.levels;
        $scope.natures = items.natures;
        $scope.hospital.city_id += "";
        var i = 0;
        var j = 0;
        for (var l in $scope.levels) {
          if (l == $scope.hospital.level) {
            $scope.hospital.level = i + "";
          }
          i++;
        };
        for (var n in $scope.natures) {
          if (n == $scope.hospital.nature) {
            $scope.hospital.nature = j + "";
          }
          j++;
        };
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function(hospital) {
          dic_hospitalHttp.editHospital({
            hospital: hospital
          }, function(data) {
            $uibModalInstance.close();
          });
        };
      },
      // size: 'sm',
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    edit_hospital.result.then(function() {
      $scope.pageChanged();
    });
  };

  $scope.open_device = function(hospital) {
    $scope.items = {
      hospital: hospital,
      projects: $scope.projects,
      device_states: $scope.device_states
    };
    var device_hospital = $uibModal.open({
      animation: $scope.hospitalEnabled,
      templateUrl: 'device_hospital.html',
      controller: function($scope, $uibModalInstance, items) {
        $scope.hospital = items.hospital;
        dic_hospitalHttp.getHospitalDevice({
          hospital_id: hospital.id
        }, function(data) {
          $scope.dic_hospital_device = data.dic_hospital_device.dic_hospital_device;
          angular.forEach($scope.dic_hospital_device, function(object, index) {
            object.id += '';
            object.device_state += '';
          });
        });
        $scope.projects = items.projects;
        $scope.device_states = items.device_states;
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function() {
          dic_hospitalHttp.saveHospitalDevice({
            hospital_id: $scope.hospital.id,
            dic_hospital_device: $scope.dic_hospital_device
          }, function(data) {})
          $uibModalInstance.dismiss('cancel');
        };
        $scope.add_device_row = function() {
          $scope.dic_hospital_device.push({
            id: "",
            name: "",
            device_state: ""
          });
        };
        $scope.delete_row = function(tr_num) {
          $scope.dic_hospital_device.splice(tr_num, 1);
        }
      },
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    device_hospital.result.then(function() {
      $scope.pageChanged();
    });
  };
}]);

controllers.controller('projectsController', ['$scope', 'projectHttp','bodiesHttp','$uibModal', function($scope, projectHttp,bodiesHttp,$uibModal) {
  'use strict';
   $scope.current_page = 1;
   $scope.maxSize = 5;
   $scope.q = "";
    projectHttp.getProjects({}, function(data) {
      $scope.projects = data.result.projects;
      $scope.total_count = data.result.total_count;
      $scope.current_page = data.result.current_page;
    });
    bodiesHttp.getCategory({}, function(data) {
      $scope.categories = data.categories;
    });
   $scope.favorite_click = function(project) {
     $scope.project = project;
     $scope.favorite_change = function (project) {
       projectHttp.editProject({project: project},function() {
       });
     }
   }
   // add new project
   $scope.open_add_project_modal = function () {
     var add_project_modal = $uibModal.open({
       templateUrl: 'add_project.html',
       controller: 'addProjectController',
       resolve: {
         items: function() {
           return $scope.categories;
         }
       }
     });
     add_project_modal.result.then(function() {
       projectHttp.getProjects({}, function(data) {
         $scope.projects = data.result.projects;
         $scope.total_count = data.result.total_count;
         $scope.current_page = data.result.current_page;
       });
       bodiesHttp.getCategory({}, function(data) {
         $scope.categories = data.categories;
       });
     });
   }
   // bodies
   $scope.open_bodies_modal = function (project) {
     var project_modal = $uibModal.open({
       templateUrl: 'edit_project_bodies.html',
       controller: 'editProjectBodiesController',
       size: 'lg',
       resolve: {
         items: function() {
           return project;
         }
       }
     });
     project_modal.result.then(function() {
       projectHttp.getProjects({}, function(data) {
         $scope.projects = data.result.projects;
         $scope.total_count = data.result.total_count;
         $scope.current_page = data.result.current_page;
       });
       bodiesHttp.getCategory({}, function(data) {
         $scope.categories = data.categories;
       });
     });
   }

   // details
   $scope.open_details_modal = function (project) {
     var project_modal = $uibModal.open({
       templateUrl: 'project_details_modal.html',
       controller: 'projectDetailsController',
       size: 'lg',
       resolve: {
         items: function() {
           return project;
         }
       }
     });
     project_modal.result.then(function() {
     });
   }

   $scope.pageChanged = function() {
     projectHttp.getProjects({
       page: $scope.current_page,
       q: $scope.q,
       category_id: $scope.category_id
     }, function(data) {
       $scope.current_page = data.result.current_page;
       $scope.total_count = data.result.total_count;
       $scope.projects = data.result.projects;
     });
   };
   $scope.setPage = function() {
     $scope.current_page = $('#go_page').val();
     $scope.pageChanged();
     $('#go_page').val("");
   };
   $scope.search = function() {
     projectHttp.getProjects({
       page: $scope.current_page,
       q: $scope.q,
       category_id: $scope.category_id
     }, function(data) {
       $scope.current_page = data.result.current_page;
       $scope.total_count = data.result.total_count;
       $scope.projects = data.result.projects;
     });
   };

   $scope.rename_ok_btn_click = function(project) {
     projectHttp.editProject({project: project},function(data) {
       $('body').click();
     });
   }
   $scope.open_edit_category_modal = function() {
     $('body').click();
     var category_modal = $uibModal.open({
       templateUrl: 'edit_project_category.html',
       controller: 'editCategoryController',
       size: 'lg',
       resolve: {
         items: function() {
           return {};
         }
       }
     });
     category_modal.result.then(function() {
       projectHttp.getProjects({}, function(data) {
         $scope.projects = data.result.projects;
         $scope.total_count = data.result.total_count;
         $scope.current_page = data.result.current_page;
       });
       bodiesHttp.getCategory({}, function(data) {
         $scope.categories = data.categories;
       });
     });
   }
}]);


controllers.controller('editProjectBodiesController', ['$scope', 'projectHttp','bodiesHttp', '$state', '$uibModalInstance','items','$uibModal', function($scope, projectHttp,bodiesHttp, $state, $uibModalInstance,items,$uibModal) {
  $scope.project = items;
  bodiesHttp.getBodyByProject({project_id: $scope.project.id},function(data) {
    $scope.bodies = data.bodies;
  });
  $scope.add_bodies_into_project = function(project) {
    var add_bodies_into_project_modal = $uibModal.open({
      templateUrl: 'add_bodies_into_project.html',
      controller: 'addBodiesIntoProjectController',
      windowClass: 'app-modal-window',
      resolve: {
        items: function() {
          return project;
        }
      }
    });
    add_bodies_into_project_modal.result.then(function() {
      bodiesHttp.getBodyByProject({project_id: $scope.project.id},function(data) {
        $scope.bodies = data.bodies;
      });
    });
  }

  $scope.body_modes_modal = function (body) {
    var body_modes_modal = $uibModal.open({
      templateUrl: 'body_modes_modal.html',
      controller: 'editBodyModesController',
      windowClass: 'app-modal-window',
      resolve: {
        items: function() {
          return body;
        }
      }
    });
    body_modes_modal.result.then(function() {
     //  $scope.getHospitalProject();
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function() {
  };
}]);


controllers.controller('editBodyModesController', ['$scope', 'bodyModesHttp','bodiesHttp', '$state', '$uibModalInstance','items','$uibModal', function($scope, bodyModesHttp,bodiesHttp, $state, $uibModalInstance,items,$uibModal) {
  $scope.body = items;
  $scope.current_page = 1;
  $scope.maxSize = 5;
  $scope.pageChanged_m = function() {
     bodyModesHttp.getBodyModes({
       page: $scope.current_page_m,
       body_id: $scope.body.id,
       limit:10
     }, function(data) {
       $scope.current_page_m = data.current_page;
       $scope.total_count_m = data.total_count;
       $scope.body_modes = data.body_modes;
     });
   };
   $scope.setPage_m = function() {
     $scope.current_pag_m = $('#go_page_m').val();
     $scope.pageChanged_m();
     $('#go_page_m').val("");
   };
  bodyModesHttp.getBodyModes({body_id: $scope.body.id,limit:10},function(data) {
    $scope.body_modes = data.body_modes;
    $scope.total_count_m = data.total_count;
    $scope.body_modes = data.body_modes;
  });
  $scope.modify_rank_ok_btn = function(bm) {
    bodyModesHttp.editBodyModes({body_mode: bm},function(data) {
      $('body').click();
    });
  }
  // 向类别中添加新的部位（body_mode）
  $scope.open_add_body_mode_modal = function () {
    var add_body_modes_modal = $uibModal.open({
      templateUrl: 'add_body_modes_modal.html',
      controller: 'addBodyModesController',
      scope: $scope,
      size: 'sm',
      resolve: {
        items: function() {
          return items;
        }
      }
    });
    add_body_modes_modal.result.then(function() {
      bodyModesHttp.getBodyModes({body_id: $scope.body.id,limit:10},function(data) {
        $scope.body_modes = data.body_modes;
        $scope.total_count_m = data.total_count;
        $scope.body_modes = data.body_modes;
      });
    });
  }
  $scope.delete_bm = function (bm) {
    bodyModesHttp.deleteBodyMode({body_mode_id: bm.id},function(data) {
      bodyModesHttp.getBodyModes({body_id: $scope.body.id,limit:10},function(data) {
        $scope.body_modes = data.body_modes;
        $scope.total_count_m = data.total_count;
        $scope.body_modes = data.body_modes;
      });
    });
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function() {
  };
}]);

controllers.controller('addBodyModesController', ['$scope', 'bodyModesHttp', '$state', '$uibModalInstance', 'items', function($scope, bodyModesHttp, $state, $uibModalInstance, items) {
  $scope.body = items;
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(bm) {
    bm.body_id = $scope.body.id;
    bodyModesHttp.createBodyMode({body_mode: bm},function(data) {
      $uibModalInstance.close();
    })
  };
}]);

controllers.controller('addProjectController', ['$scope', 'projectHttp','citiesHttp', '$state', '$uibModalInstance','items', function($scope, projectHttp, citiesHttp, $state, $uibModalInstance,items) {
  $scope.categories = items;
  citiesHttp.getOpenedCities({},function (data) {
    $scope.cities = data.cities;
  });
  $scope.cancel = function() {
    $uibModalInstance.close();
  };
  $scope.save = function(new_pj,cities) {
    var opened_cities = [];
    angular.forEach(cities, function(object, index) {
      if(object.opened_cities){
        opened_cities.push(object.id);
      }
    });
    new_pj.cities = opened_cities;
    projectHttp.addProject({project: new_pj},function(data) {
      $uibModalInstance.close();
    });
  };
}]);

controllers.controller('editCategoryController', ['$uibModal','$scope', 'categoriesHttp', '$state', '$uibModalInstance', 'items', function($uibModal,$scope, categoriesHttp, $state, $uibModalInstance, items) {
   "use strict";
  categoriesHttp.getCategories({}, function(data) {
    $scope.categories = data.categories;
  });

  $scope.delete = function(_id) {
    categoriesHttp.deleteCategory({
      id: _id
    }, function(data) {
      categoriesHttp.getCategories({}, function(data) {
        $scope.categories = data.categories;
      });
    });
  };
  $scope.cancel = function() {
    $uibModalInstance.close();
  };

  $scope.select_flag = function(category) {
    $scope.placement = {
      options: [
        '是',
        '否'
      ],
      selected: category.flag ? '是' : '否'
    }
    $scope.category = category;
  }

  $scope.flag_change = function() {
    var category = $scope.category;
    if ($scope.placement.selected == "是") {
      category.flag = true;
    } else if ($scope.placement.selected == "否") {
      category.flag = false;
    }
    categoriesHttp.updateCategory({
      category: category
    }, function(data) {});
  }

  //打开新建框
  $scope.open_new = function() {
    var new_category = $uibModal.open({
      // animation: $scope.hospitalEnabled,
      templateUrl: 'new_categories.html',
      controller: 'newCategoriesController',
      size: 'sm'
    });
    new_category.result.then(function() {
      categoriesHttp.getCategories({}, function(data) {
        $scope.categories = data.categories;
      });
    });
  };
  $scope.update = function(category) {
    var new_category = $uibModal.open({
      templateUrl: 'update_categories.html',
      controller: 'updateCategoriesController',
      size: 'sm',
      resolve: {
        items: function() {
          return category;
        }
      }
    });
    new_category.result.then(function() {
      categoriesHttp.getCategories({}, function(data) {
        $scope.categories = data.categories;
      });
    });
  };

}]);

controllers.controller('addBodiesIntoProjectController', ['$scope', 'projectHttp','bodiesHttp', '$state', '$uibModal', '$uibModalInstance','items', function($scope, projectHttp,bodiesHttp, $state, $uibModal, $uibModalInstance, items) {
  $scope.project = items;
  bodiesHttp.getBodyByProject({project_id: $scope.project.id},function(data) {
    $scope.project_bodies = data.bodies;
    var arr = [];
    angular.forEach(data.bodies, function(object, index) {
      arr.push(object.id);
    });
    $scope.body_id_arr = arr;
  });
  // 添加所有的bodies
  $scope.getBody = function(){
    bodiesHttp.getBody({category_id: $scope.project.category_id},function(data) {
      $scope.bodies = data.bodies;
    });
  }

  $scope.getBody();

  $scope.contains = function(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }
  $scope.cancel = function() {
    $uibModalInstance.close();
  };
  $scope.save = function() {
    var arr = [];
    angular.forEach($scope.bodies, function(object, index) {
      if(object.isChecked){
        arr.push(object.id);
      }
    });
    projectHttp.editBodies({project_id: $scope.project.id, bodies_ids: arr},function (data) {
      $uibModalInstance.close();
    });
  };
  $scope.add_body = function(){
    var add_body = $uibModal.open({
      animation: true,
      templateUrl: 'add_body.html',
      controller: 'addBodyController',
      size: 'sm',
      resolve: {
        items: function() {
          return $scope.project;
        }
      }
    });
    add_body.result.then(function() {
      $scope.getBody();
    });
  }
}]);

controllers.controller('addBodyController', ['$scope' ,'bodiesHttp', 'categoriesHttp', '$state', '$uibModalInstance','items', function($scope, bodiesHttp, categoriesHttp, $state, $uibModalInstance,items) {
  $scope.project = items;
  categoriesHttp.getCategories({}, function(data) {
    $scope.categories = data.categories;
  });
  $scope.save = function(){
    bodiesHttp.createBody({body: $scope.body}, function(data){
      if(data.success){
        $uibModalInstance.close();
      }
    });
  };
  $scope.cancel = function(){
    $uibModalInstance.close();
  }
}]);

controllers.controller('citiesController', ['$scope', 'citiesHttp', function($scope, citiesHttp) {
  "use strict";
  $scope.maxSize = 5;
  $scope.current_page = 1;
  $scope.dynamicPopover = {
    templateUrl: 'myPopSelectTemplate.html',
    title: 'Title'
  };
  $scope.city_search = function() {
    citiesHttp.getCities({
      q: $scope.search_city_name
    }, function(data) {
      $scope.cities = data.cities;
    });
  }
  citiesHttp.getCities({}, function(data) {
    $scope.cities = data.cities;
    $scope.total_count = data.total_count;
  });
  $scope.pageChanged = function() {
    citiesHttp.getCities({
      page: $scope.current_page
    }, function(data) {
      $scope.cities = data.cities;
    });
  }
  $scope.setPage = function() {
    citiesHttp.getCities({
      page: $scope.current_page
    }, function(data) {
      $scope.cities = data.cities;
    });
  }
  $scope.select_change = function() {
    var params = {};
    switch ($scope.change_type) {
      case 'state':
        var state;
        if ($scope.placement.selected == "是") {
          state = true;
        } else if ($scope.placement.selected == "否") {
          state = false;
        }
        params = {
          id: $scope.city_id,
          state: state
        };
        break;
      case 'maturity':
        var maturity;
        if ($scope.placement.selected == "新区") {
          maturity = "newarea";
        } else if ($scope.placement.selected == "半成熟区") {
          maturity = "half";
        } else if ($scope.placement.selected == "成熟区") {
          maturity = "mature";
        }
        params = {
          id: $scope.city_id,
          maturity: maturity
        };
        break;
    }
    citiesHttp.changeCities(params, function(data) {
      if (data.success) {
        if ($scope.change_type == "state") {
          $scope.city_info.state = params.state;
        } else {
          $scope.city_info.maturity_zh = $scope.placement.selected;
        }
        //$uibTooltipProvider.setTriggers('closeTrigger');
      }
    });
  }
  $scope.input_select = {};
  $scope.input_click = function() {
    var params = {};
    switch ($scope.change_type) {
      case 'go_public_sea_day':
        params = {
          id: $scope.city_id,
          go_public_sea_day: $scope.input_select.value
        };
        break;
      case 'develop_coefficient':
        params = {
          id: $scope.city_id,
          develop_coefficient: $scope.input_select.value
        };
        break;
    }
    citiesHttp.changeCities(params, function(data) {
      if (data.success) {
        if ($scope.change_type == "go_public_sea_day") {
          $scope.city_info.go_public_sea_day = $scope.input_select.value;
        } else {
          $scope.city_info.develop_coefficient = $scope.input_select.value;
        }
      }
    });
  }
  $scope.select_click = function(...values) {
    $scope.change_type = values[0];
    $scope.city_id = values[2];
    $scope.city_info = values[3];
    switch (values[0]) {
      case 'state':
        $scope.dynamicPopover = {
          templateUrl: 'myPopSelectTemplate.html',
          title: '选择状态'
        };
        $scope.placement = {
          options: [
            '是',
            '否'
          ],
          selected: values[1] ? '是' : '否'
        }
        break;
      case 'go_public_sea_day':
        $scope.dynamicPopover = {
          templateUrl: 'myPopInputTemplate.html',
          title: '设置天数'
        };
        $scope.input_select.value = values[1];
        break;
      case 'develop_coefficient':
        $scope.dynamicPopover = {
          templateUrl: 'myPopInputTemplate.html',
          title: '设置系数'
        };
        $scope.input_select.value = values[1];
        break;
      case 'maturity':
        $scope.dynamicPopover = {
          templateUrl: 'myPopSelectTemplate.html',
          title: '设置成熟度'
        };
        $scope.placement = {
          options: [
            '新区',
            '半成熟区',
            '成熟区'
          ],
          selected: values[1]
        }
        break;
    }
  }
}]);

controllers.controller('operationlogsController', ['$scope', 'operationlogsHttp', function($scope, operationlogsHttp) {
  "use strict";
  $scope.self = $scope;
  $scope.maxSize = 5;
  $scope.current_page = 1;

  operationlogsHttp.getOperationlogs({}, function(data) {
    $scope.operation_logs = data.result.operation_logs;
    $scope.total_count = data.result.total_count;
    $scope.current_page = data.result.current_page;
  });

  operationlogsHttp.getOperationlogtypes({}, function(data) {
    $scope.operation_log_types = data.result.operation_log_types;
  });

  $scope.search = function() {
    operationlogsHttp.getOperationlogs({
      operation_log_type_id: $scope.operation_log_type,
      user_realname: $scope.user_realname,
      keyword: $scope.keyword,
      start_time: $scope.start_time,
      end_time: $scope.end_time
    }, function(data) {
      $scope.operation_logs = data.result.operation_logs;
      $scope.total_count = data.result.total_count;
      $scope.current_page = data.result.current_page;
    });
  }

  $scope.refresh = function() {
    $scope.operation_log_type = '';
    $scope.user_realname = "";
    $scope.keyword = "";
    $scope.start_time = "";
    $scope.end_time = "";
    operationlogsHttp.getOperationlogs({}, function(data) {
      $scope.operation_logs = data.result.operation_logs;
      $scope.total_count = data.result.total_count;
      $scope.current_page = data.result.current_page;
    });
  }

  $scope.pageChanged = function() {
    operationlogsHttp.getOperationlogs({
      page: $scope.current_page
    }, function(data) {
      $scope.operation_logs = data.result.operation_logs;
    });
  }

  $scope.setPage = function() {
    operationlogsHttp.getOperationlogs({
      page: $scope.current_page
    }, function(data) {
      $scope.operation_logs = data.result.operation_logs;
    });
  }
}]);

controllers.controller('newCategoriesController', ['$scope', 'categoriesHttp', '$state', '$uibModalInstance', function($scope, categoriesHttp, $state, $uibModalInstance) {
  $scope.category = {};
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(category) {
    categoriesHttp.createCategory({
      category: $scope.category
    }, function(data) {
      $uibModalInstance.close();
    });
  };
}]);

controllers.controller('updateCategoriesController', ['$scope', 'categoriesHttp', '$state', '$uibModalInstance', 'items', function($scope, categoriesHttp, $state, $uibModalInstance, items) {
  $scope.category = items;
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(category) {
    categoriesHttp.updateCategory({
      category: $scope.category
    }, function(data) {
      $uibModalInstance.close();
    });
  };
}]);

controllers.controller('projectDetailsController', ['$scope' ,'projectHttp', '$state', '$uibModalInstance', 'items', function($scope, projectHttp, $state, $uibModalInstance, items) {
  $scope.project = items;
  projectHttp.getProjectOpenedCitiesHospitals({id: items.id},function(data) {
    $scope.cities = data.cities;
  });
  $scope.cancel = function() {
    $uibModalInstance.close();
  };
}]);

controllers.controller('hospitalsController', ['$scope', 'hospitalHttp', 'projectHttp', 'citiesHttp','bodiesHttp', '$state', '$log', '$uibModal','$confirm', function($scope, hospitalHttp, projectHttp, citiesHttp,bodiesHttp, $state, $log, $uibModal,$confirm) {
  "use strict";
  $scope.self = $scope;
  $scope.maxSize = 5;
  $scope.city_id = "";
  $scope.q = "";
  $scope.hospitalEnabled = true;
  hospitalHttp.getHospital({}, function(data) {
    $scope.hospitals = data.hospitals;
    $scope.current_page = data.current_page;
    $scope.total_count = data.total_count;
  });
  citiesHttp.getOpenedCities({}, function(data) {
    $scope.cities = data.cities;
  });
  $scope.flag_click = function(hospital) {
    $scope.hospital = hospital;
    $scope.flag_change = function (hospital) {
      var text_str = hospital.flag ? '确定要开启医院吗？' : '确定要关闭医院吗？'
      $confirm({text: text_str, title: '医院状态'})
        .then(function() {
          hospitalHttp.editHospital({hospital: hospital},function(data) {
          });
        });
    }
  }
  $scope.show_bridging_hospital_arr = function (obj) {
    var arr = [];
    angular.forEach(obj, function(object, index) {
      arr.push(object.name);
    });
    return arr.join(", ");
  }
  $scope.pageChanged = function() {
    hospitalHttp.getHospital({
      page: $scope.current_page,
      q: $scope.q,
      city_id: $scope.city_id
    }, function(data) {
      $scope.current_page = data.current_page;
      $scope.hospitals = data.hospitals;
    });
  };
  $scope.setPage = function() {
    $scope.current_page = $('#go_page').val();
    $scope.pageChanged();
    $('#go_page').val("");
  };
  $scope.search = function() {
    hospitalHttp.getHospital({
      q: $scope.q,
      city_id: $scope.city_id
    }, function(data) {
      $scope.hospitals = data.hospitals;
      $scope.current_page = data.current_page;
      $scope.total_count = data.total_count;
    });
  };
  $scope.open_new = function() {
    var new_hospital = $uibModal.open({
      animation: true,
      templateUrl: 'new_hospital.html',
      controller: 'newCorperateHospitalController',
    });
    new_hospital.result.then(function() {
      $scope.pageChanged();
    });
  }
  $scope.open_hospital_project = function(size, id,hospital) {
    $scope.items = {
      hospital_id: id,
      hospital: hospital
    }
    var hospital_project = $uibModal.open({
      animation: true,
      templateUrl: 'hospital_project.html',
      size: 'lg',
      controller: function($scope, $uibModalInstance, items, projectHttp, hospitalHttp) {
        //编辑详情
        $scope.hospital = items.hospital;
        $scope.open_project_detail_modal = function (project){
            $scope.items = {
              project: project,
              hospital: hospital
            };
            var project_detail_modal = $uibModal.open({
              animation: true,
              templateUrl: 'edit_project_detail.html',
              controller: 'editProjectDetailController',
              size: size,
              resolve: {
                  items: function() {
                    return $scope.items;
                  }
                }
              });
            project_detail_modal.result.then(function() {
            });
        }

          //编辑医院资源
        $scope.open_hospital_resources = function( project_id) {
          $scope.items = {
            hospital_id: items.hospital_id,
            project_id: project_id
          }
          var edit_hospital_resources = $uibModal.open({
            animation: true,
            templateUrl: 'edit_hospital_resources.html',
            controller: function($scope, $uibModalInstance, items) {
              hospitalHttp.getHospitalResources({
                hospital_id: items.hospital_id,
                project_id: items.project_id
              }, function(data) {
                $scope.co_hospital_resource = data.co_hospital_resource;
                $scope.co_appointment_config = data.co_appointment_config;
              })
              $scope.save = function() {
                hospitalHttp.editHospitalResources({
                  co_hospital_resource: $scope.co_hospital_resource,
                  co_appointment_config: $scope.co_appointment_config
                }, function(data) {
                  $uibModalInstance.close();
                })
              };
              $scope.cancel = function() {
                $uibModalInstance.close();
              };
            },
            resolve: {
              items: function() {
                return $scope.items;
              }
            }
          });
        }
					// 部位与价格
					$scope.bodies_click = function(project) {
				    $scope.modal_template = {project:project};
            bodiesHttp.getBodyByProject({project_id: project.project_id}, function(data) {
              $scope.project_bodies = data.bodies;
            });
						$scope.open_edit_price = function (body) {
              var modal_datas = {
                hospital: items.hospital,
                project: project,
                body: body
              };
							var body_price = $uibModal.open({
		            templateUrl: 'edit_hospital_bodies_price.html',
		            controller: 'editHospitalBodiesPriceController',
		            size: 'lg',
		            resolve: {
		              items: function() {
		                return modal_datas;
		              }
		            }
		          });
		          body_price.result.then(function() {
		          });
						};
			  };

        $scope.add_project = function() { //纳入项目
          $scope.items = {
            hospital_id: id,
            hospital: items.hospital
          };
          var projects_modal = $uibModal.open({
            templateUrl: 'add_project.html',
            controller: 'addProjectToHospitalController',
            size: 'lg',
            resolve: {
              items: function() {
                return $scope.items;
              }
            }
          });
          projects_modal.result.then(function() {
            $scope.getHospitalProject();
          });
        }


        $scope.getHospitalProject = function() {
          hospitalHttp.getHospitalProjects({
            hospital_id: items.hospital_id
          }, function(data) {
            $scope.projects = data.projects;
          });
        };
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.change_status = function(project, field) {
          if (field == 'mbf') {
            if (project.mbf) {
              project.mbf = false;
            } else {
              project.mbf = true;
            };
          };
          if (field == 'status') {
            if (project.status != 'busy') {
              project.status = 'busy';
            } else {
              project.status = 'default';
            };
          };
          hospitalHttp.editHospitalProjects({
            project: project
          }, function(data) {
            $scope.getHospitalProject();
          })
        }
        $scope.getHospitalProject();
        //打开编辑框
        $scope.open_edit = function(size, project, field, field_ch) {
          $scope.items = {
            project: project,
            field: field,
            field_ch: field_ch
          }
          var edit_hospital_project = $uibModal.open({
            animation: true,
            templateUrl: 'edit_hospital_project.html',
            controller: function($scope, $uibModalInstance, items) {
              $scope.project = items.project;
              $scope.field = items.field;
              $scope.field_ch = items.field_ch;
              $scope.cancel = function() {
                $uibModalInstance.close();
              };
              $scope.edit_project = function(project) {
                hospitalHttp.editHospitalProjects({
                  project: project
                }, function(data) {
                  $uibModalInstance.close();
                })
              };
            },
            size: size,
            resolve: {
              items: function() {
                return $scope.items;
              }
            }
          });
          edit_hospital_project.result.then(function() {
            $scope.getHospitalProject();
          });
        };


      },
      size: size,
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    hospital_project.result.then(function() {
      $scope.pageChanged();
    });
  }

  $scope.open_device = function(hospital){
    var hospital_device = $uibModal.open({
      templateUrl: 'hospital_device.html',
      controller: 'hospitalDeviceController',
      size: 'lg',
      resolve: {
        items: function() {
          return hospital;
        }
      }
    });
  }

  $scope.open_detail = function(hospital) {
    var new_modal = $uibModal.open({
      templateUrl: 'hospital_detail.html',
      controller: 'hospitalDetailController',
      size: 'lg',
      resolve: {
        items: function() {
          return hospital;
        }
      }
    });
  }

  $scope.open_assistant = function(hospital) {
    var new_modal = $uibModal.open({
      templateUrl: 'assistants_detail.html',
      controller: 'assistantsDetailController',
      size: 'lg',
      resolve: {
        items: function() {
          return hospital;
        }
      }
    });
  }

  $scope.open_bridging_hospitals_modal = function (hospital) {
    var new_modal = $uibModal.open({
      templateUrl: 'bridging_hospitals.html',
      controller: 'bridgingHospitalsController',
      windowClass: 'app-modal-window',
      size: 'lg',
      resolve: {
        items: function() {
          return hospital;
        }
      }
    });
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

controllers.controller('hospitalDetailController', ['hospitalHttp', '$scope', '$state', '$uibModalInstance', 'items', function(hospitalHttp, $scope, $state, $uibModalInstance, items) {
  $scope.hospital = items;
  $scope.category = {};
  $scope.lnglat = items.lng + "," + items.lat;
  $scope.$watch('lnglat', function(newValue, oldValue) {
    var strs = newValue.split(",");
    $scope.hospital.lng = strs[0];
    $scope.hospital.lat = strs[1];
  }, true);
  $scope.map_src = "http://restapi.amap.com/v3/staticmap?markers=mid,0xFF0000,A:" + items.lng + "," + items.lat + "&key=9c9644d7b9d2f53e6d77449129f411cd&zoom=17&size=570*492";
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(hospital) {
    hospitalHttp.editHospital({
      hospital: hospital
    }, function(data) {
      $state.reload();
      $uibModalInstance.dismiss('cancel');
    });
  };
}]);

controllers.controller('newCorperateHospitalController', ['dic_hospitalHttp','hospitalHttp', '$scope', '$state', '$uibModalInstance','citiesHttp', function(dic_hospitalHttp,hospitalHttp, $scope, $state, $uibModalInstance,citiesHttp) {
  citiesHttp.getOpenedCities({},function (data) {
      $scope.cities = data.cities;
    });
  $scope.input_change = function(input_name) {
      if(input_name!=""){
        dic_hospitalHttp.getHospital({q: input_name,limit: 5,city_id: $scope.city_id},function(data) {
          $scope.searching_hospitals = data.hospitals;
          $('#search_panel').show();
        });
      }
  }

  $scope.hide_search = function () {
    var display = $('#search_panel').css('display');
    if(display != 'none'){
       $('#search_panel').hide();
    }
  }
  $scope.show_search = function () {
    $('#search_panel').show();
  }

  $scope.input_ok_click = function(input_name) {
    dic_hospitalHttp.getHospital({q: input_name,limit: 5,city_id: $scope.city_id},function(data) {
      $scope.searched_hospitals = data.hospitals;
    });
  }

  $scope.rm_to_table = function(sh) {
    arr = [sh];
    $scope.searched_hospitals = arr;
  }

  $scope.cancel = function() {
    $uibModalInstance.close();
  };
  $scope.save = function(hospital) {
    angular.forEach($scope.searched_hospitals, function(object, index) {
      if(object.isSelected){
        console.log(object.isSelected); //dic_hospital_id
        hospitalHttp.addHospital({
          dic_hospital_id: object.isSelected
        }, function(data) {
          $state.reload();
          $uibModalInstance.close();
        });
      }
    });
  };
}]);

controllers.controller('assistantsDetailController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function($scope, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.hospital = items;
  $scope.add_assistant_row = function() {
    $scope.hospital.hospital_assistants.push({
      id: "",
      name: ""
    });
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
    $state.reload();
  };
  $scope.save = function(category) {};

  $scope.delete_click = function(assistant) {
    hospitalHttp.deleteHospitalAssistants({
      id: assistant.id
    }, function(data) {
      $state.reload();
      $uibModalInstance.dismiss('cancel');
    });
  };

  $scope.add_click = function(assistant, hospital_id) {
    assistant.hospital_id = hospital_id;
    hospitalHttp.addHospitalAssistants({
      assistant: assistant
    }, function(data) {
      $state.reload();
      $uibModalInstance.dismiss('cancel');
    });
  };
  $scope.select_click = function(state, assistant) {
    $scope.modal_template = {};
    switch (state) {
      case 'name':
        $scope.dynamicPopover = {
          title: '人员姓名'
        };
        $scope.input_click = function() {
          assistant.name = $scope.modal_template.value;
          hospitalHttp.editHospitalAssistants({
            hospital_assistant: assistant
          }, function(data) {});
        };
        break;
      case 'phone':
        $scope.dynamicPopover = {
          title: '手机号码'
        };
        $scope.input_click = function() {
          assistant.phone = $scope.modal_template.value;
          hospitalHttp.editHospitalAssistants({
            hospital_assistant: assistant
          }, function(data) {});
        };
        break;
      case 'address':
        $scope.dynamicPopover = {
          title: '地址'
        };
        $scope.input_click = function() {
          assistant.address = $scope.modal_template.value;
          hospitalHttp.editHospitalAssistants({
            hospital_assistant: assistant
          }, function(data) {});
        };
        break;
      case 'state':
        $scope.select_change = function() {
          assistant.state = $scope.modal_template.selected;
          hospitalHttp.editHospitalAssistants({
            hospital_assistant: assistant
          }, function(data) {});
        };
        break;
      case 'remark':
        $scope.dynamicPopover = {
          title: '备注'
        };
        $scope.input_click = function() {
          assistant.remark = $scope.modal_template.value;
          hospitalHttp.editHospitalAssistants({
            hospital_assistant: assistant
          }, function(data) {

          });
        };
        break;
      default:
        break;
    }
  };
}]);

controllers.controller('bridgingHospitalsController', ['hospitalHttp','$scope', '$state', '$uibModalInstance', 'items', function(hospitalHttp,$scope, $state, $uibModalInstance, items) {
  $scope.hospital = items;
  hospitalHttp.getCooperatingHospital({city_id: $scope.hospital.city_id},function (data) {
    $scope.opened_hospitals = data.hospitals
  });
  $scope.bridging_contains = function(bridgings,brige_id) {
    var result = false;
    angular.forEach(bridgings, function(object, index) {
      if(brige_id==object.id){
        result = true;
      }
    });
    return result;
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function(opened_hospitals) {
    arr = [];
    angular.forEach(opened_hospitals, function(object, index) {
      if(object.isChecked){
        arr.push(object.id);
      }
    });
    hospitalHttp.editCooperatingHospital({hospital_id: $scope.hospital.id,cooperating_hospital_ids: arr},function(data) {
      $state.reload();
      $uibModalInstance.dismiss('cancel');
    });
  };
}]);

controllers.controller('editHospitalBodiesPriceController', ['$scope', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function($scope, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.items = items;
  hospitalHttp.getProjectRelations({hospital_id: items.hospital.id,project_id: items.project.id ,body_id: items.body.id},function (data) {
    $scope.project_relations = data.project_relations;
  });
  $scope.select_click = function (pr) {
    $scope.pr = pr;
    $scope.select_change = function () {
      hospitalHttp.editProjectRelations({project_relations: $scope.pr},function (data) {
      });
    }
  }
  $scope.price_input_click = function (pr) {
    $scope.pr = pr;
  }
  $scope.income_price_input_click = function (pr) {
    $scope.pr = pr;
  }
  $scope.income_price_btn_click = function () {
    hospitalHttp.editProjectRelations({project_relations: $scope.pr},function (data) {
      $('body').click();
    });
  }
  $scope.price_btn_click = function () {
    hospitalHttp.editProjectRelations({project_relations: $scope.pr},function (data) {
      $('body').click();
    });
  }
  $scope.choose_popover =function (obj) {
    $scope.choose = obj;
  }
  $scope.multipleModifyPriceBtnClick = function(val) {
    if($scope.choose==='price'){
      hospitalHttp.editProjectRelationsMultiple({price: val,hospital_id: items.hospital.id, body_id: items.body.id,project_id: items.project.project_id},function(data) {
        refresh_data();
      });
    }else if($scope.choose==='income_price'){
      hospitalHttp.editProjectRelationsMultiple({income_price: val,hospital_id: items.hospital.id, body_id: items.body.id,project_id: items.project.project_id},function(data) {
        refresh_data();
      });
    }else if($scope.choose==='state'){
      hospitalHttp.editProjectRelationsMultiple({state: val,hospital_id: items.hospital.id, body_id: items.body.id,project_id: items.project.project_id},function(data) {
        refresh_data();
      });
    }
  }
  function refresh_data() {
    hospitalHttp.getProjectRelations({hospital_id: items.hospital.id,project_id: items.project.id ,body_id: items.body.id},function (data) {
      $scope.project_relations = data.project_relations;
    });
    $('body').click();
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

}]);

controllers.controller('hospitalDeviceController', ['hospitalHttp', '$scope', '$state', '$uibModalInstance', 'items', '$uibModal', function(hospitalHttp, $scope, $state, $uibModalInstance, items, $uibModal) {
  $scope.hospital = items;
  $scope.hospital_devices = $scope.hospital.hospital_project_infos;
  $scope.cancel = function() {
    $uibModalInstance.close();
  };
  $scope.show_img = function(url) {
    if(url==''||url==null)
      return '';
    var result = "";
    var pre_str = url.substring(0,4);
    if(pre_str!='http'){
      result = "http://kz.txzs.org" + url;
    }
    return result;
  }
  $scope.open_img = function(project_image) {
    var img_url = $scope.show_img(project_image);
    $scope.items = {
      img_url: img_url,
    }
    var modal = $uibModal.open({
      animation: true,
      templateUrl: 'showImgTemplate.html',
      controller: function($scope, $uibModalInstance, items) {
        $scope.popover_img_url = items.img_url;
        $scope.cancel = function() {
          $uibModalInstance.close();
        };
      },
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
  }
  $scope.close = function() {
    $uibModalInstance.close();
  };
  $scope.create = function() {
    $scope.items = {
      hospital_id: $scope.hospital.id
    }
    var create_hospital_device = $uibModal.open({
      animation: true,
      templateUrl: 'create_hospital_device.html',
      controller: function($scope, $uibModalInstance, items, hospitalHttp) {
        $scope.hospital_id = items.hospital_id;
        $scope.hospital_device = {
          hospital_id: items.hospital_id,
          project_title: '',
          project_content: '',
          project_image: ''
        }
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function() {
          hospitalHttp.createHospitalProject({hospital_device: $scope.hospital_device},function(data){
            $uibModalInstance.close(data.hospital_device);
          })
        }
      },
      size: "md",
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    create_hospital_device.result.then(function(data) {
      $scope.hospital_devices.push(data);
    });
  };
  $scope.update = function(hospital_device){
    var update_hospital_device = $uibModal.open({
      animation: true,
      templateUrl: 'create_hospital_device.html',
      controller: function($scope, $uibModalInstance, hospitalHttp) {
        $scope.hospital_device = hospital_device;
        $scope.cancel = function() {
          $uibModalInstance.dismiss("cancel");
        };
        $scope.save = function() {
          hospitalHttp.updateHospitalProject({hospital_device: $scope.hospital_device},function(data){
            $uibModalInstance.close($scope.hospital_device);
          })
        }
      },
      size: "md",
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
  };
  $scope.delete = function(hospital_device,$index){
    hospitalHttp.deleteHospitalDevice({hospital_device: hospital_device}, function(data){
      $scope.hospital_devices.splice($index,1);
    })
  }
}]);

controllers.controller('editProjectDetailController', ['$scope', 'projectHttp', 'hospitalHttp', '$state', '$uibModalInstance', 'items', function($scope, projectHttp, hospitalHttp, $state, $uibModalInstance, items) {
  $scope.project = items.project;
  $scope.hospital = items.hospital;
  $scope.add_workflow_row = function() {
    $scope.project.inspection_workflows.push({
      step: "",
      step_description: ""
    });
  };

  $scope.input_ok_click = function (input_value) {
    $('body').click();
  }
  $scope.delete_row = function(tr_num) {
    $scope.project.inspection_workflows.splice(tr_num, 1);
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function() {
    hospitalHttp.editHospitalProjects({project: $scope.project}, function(data) {
    });
    hospitalHttp.updateInspectionWorkflows({hospital_project_id: $scope.project.id, inspection_workflows: $scope.project.inspection_workflows}, function(data) {
      $uibModalInstance.close();
    });
  };
}]);

controllers.controller('manageOrdersController', ['$scope', 'manageOrdersHttp', '$uibModal', function($scope, manageOrdersHttp, $uibModal) {
  $scope.self = $scope;
  $scope.current_page = 1;
  $scope.maxSize = 5;
  $scope.high_search = false;
  $scope.state_ids= [];
  $scope.states = [
    {name: '处理中', id: '0'},
    {name: '未付款', id: '1'},
    {name: '已付款', id: '2'},
    {name: '已取消', id: '3'},
    {name: '待处理', id: '4'},
    {name: '待定', id: '5'},
    {name: '测试单', id: '6'},
  ];

  $scope.getOrderList = function(){
    manageOrdersHttp.getOrderList({
      city_id: $scope.city_id,
      q: $scope.q,
      page: $scope.current_page,
      agent_q: $scope.agent_q,
      hospital_q: $scope.hospital_q,
      doctor_q: $scope.doctor_q,
      assistant_q: $scope.assistant_q,
      body_mode_q: $scope.body_mode_q,
      project_id: $scope.project_id,
      state_ids: $scope.state_ids,
      make_time_start: $scope.make_time_start,
      make_time_end: $scope.make_time_end,
      finish_time_start: $scope.finish_time_start,
      finish_time_end: $scope.finish_time_end
    },function(data){
      $scope.orders = data.orders;
      $scope.order_statistic = data.order_statistic;
      $scope.total_count = data.total_count;
      $scope.current_page = data.current_page;
    });
  }
  $scope.getOrderList();

  manageOrdersHttp.getOptionAttr({},function(data){
    $scope.cities = data.cities;
    $scope.projects = data.projects;
  });

  $scope.setPage = function() {
    $scope.current_page = $('#go_page').val();
    $scope.getOrderList();
    $('#go_page').val("");
  }
  $scope.search = function() {
    $scope.make_time_start = $('#make_start').val();
    $scope.make_time_end = $('#make_end').val();
    $scope.finish_time_start = $('#finish_start').val();
    $scope.finish_time_end = $('#finish_end').val();
    $scope.current_page = 1;
    $scope.state_ids = [];
    angular.forEach($scope.states, function(obj,index){
      if(obj.isChecked){
        $scope.state_ids.push(obj.id);
      }
    });
    $scope.getOrderList();
  }
  $scope.check_high_search = function(){
    return $scope.high_search;
  }
  $scope.show_high_search = function(){
    $scope.high_search = !$scope.high_search;
  }
  $scope.clear_search = function(){
    $scope.agent_q = '';
    $scope.hospital_q = '';
    $scope.doctor_q = '';
    $scope.assistant_q = '';
    $scope.body_mode_q = '';
    $scope.project_id = '';
    $scope.city_id = '';
    $scope.q = '';
    $('#make_start').val('');
    $('#make_end').val('');
    $('#finish_start').val('');
    $('#finish_end').val('');
    angular.forEach($scope.states, function(obj,index){
      if(obj.isChecked){
        obj.isChecked = false;
      }
    });
    $scope.getOrderList();
  }

  $scope.make_start = {
      dateCell: '#make_start',
      format: 'YYYY-MM-DD hh:mm:ss',
      minDate: '2014-01-01 00:00:00', //设定最小日期为当前日期
      festival:true,
      maxDate: '2099-06-16 23:59:59', //最大日期
      isTime: true
  };
  $scope.make_end = {
      dateCell: '#make_end',
      format: 'YYYY-MM-DD hh:mm:ss',
      minDate: '2014-01-01 00:00:00', //设定最小日期为当前日期
      festival:true,
      maxDate: '2099-06-16 23:59:59', //最大日期
      isTime: true
  };
  $scope.finish_start = {
      dateCell: '#finish_start',
      format: 'YYYY-MM-DD hh:mm',
      minDate: '2014-01-01 00:00:00', //设定最小日期为当前日期
      festival:true,
      maxDate: '2099-06-16 23:59:59', //最大日期
      isTime: true
  };
  $scope.finish_end = {
      dateCell: '#finish_end',
      format: 'YYYY-MM-DD hh:mm',
      minDate: '2014-01-01 00:00:00', //设定最小日期为当前日期
      festival:true,
      maxDate: '2099-06-16 23:59:59', //最大日期
      isTime: true
  };
  jeDate($scope.make_start);
  jeDate($scope.make_end);
  jeDate($scope.finish_start);
  jeDate($scope.finish_end);

  $scope.order_detail = function(id){
    $scope.items = id;
    var order_detail = $uibModal.open({
      templateUrl: 'order_detail.html',
      controller: 'orderDetailController',
      size: 'lg',
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    order_detail.result.then(function() {
    });
  }
}]);

controllers.controller('orderDetailController', ['$scope', 'manageOrdersHttp', '$uibModalInstance', 'items', function($scope, manageOrdersHttp, $uibModalInstance, items) {
  $scope.self = $scope;
  $scope.order_id = items;
  manageOrdersHttp.getOrderDetail({order_id: $scope.order_id},function(data){
    console.log(data.order_detail);
    $scope.order_detail = data.order_detail;
  })
}]);
