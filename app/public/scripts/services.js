var services = angular.module('services', []);
//公共服务,处理网络请求异常或者程序异常等等情况
// params{result, status, headers, config, paramsObj}
services.factory("handleHttpError", function(){
    return {
        deal_app_error: function(params) {
            if (!params.result || !params.result.success) {
                params && params["paramsObj"] && (params["error_code"] = "app_error") && params["paramsObj"]["errorDo"] && params["paramsObj"]["errorDo"](params);
                return false;
            }
            return true;
        },
        deal_network_error: function(params){
            console.log("错误码:", params.status);
            params && params["paramsObj"] && (params["error_code"] = "network_error") && params["paramsObj"]["errorDo"] && params["paramsObj"]["errorDo"](params);
            return false;
        }
    }
});

// paramsObj {url: '/', params:{a:1, b:1}, successDo:function(handleResult), errorDo:(handleResult), alwaysDo:(isError, handleResult)}
services.factory('httpBase', ['$http', 'handleHttpError', function($http, handleHttpError){
    return{
        request: function(paramsObj){
            var requestObj = {method: paramsObj.method, url: paramsObj.url};
            if (paramsObj.method == "GET"){
                requestObj.params = paramsObj.params;
            }else {
                requestObj.data = paramsObj.params;
            }

            $http(requestObj).success(function(result,status,headers,config){
                var handleResult = {result: result,status: status,headers: headers,config:config, paramsObj:paramsObj};
                var isErr = true;
                if(handleHttpError.deal_app_error(handleResult)){
                    isErr = false;
                    paramsObj["successDo"] && paramsObj["successDo"](handleResult["result"],handleResult);
                }
                paramsObj["alwaysDo"] && paramsObj["alwaysDo"](isErr, handleResult);
            }).error(function(result,status,headers,config){
                var handleResult = {result: result,status: status,headers: headers,config:config, paramsObj:paramsObj};
                handleHttpError.deal_network_error(handleResult);
                paramsObj["alwaysDo"] && paramsObj["alwaysDo"](handleResult, true);
            })
        },

        get: function(paramsObj){
            paramsObj.method = "GET";
            this.request(paramsObj);
        },

        post: function(paramsObj){
            paramsObj.method = "POST";
            this.request(paramsObj);
        },
        put: function(paramsObj){
            paramsObj.method = "PUT";
            this.request(paramsObj);
        }
    }
}]);

// custom userHttp demo
services.factory('userHttp', ['httpBase', function(httpBase){
    return {
        login: function(params, successDo, errorDo, alwaysDo){
            httpBase.post({
                url: '/api/users/login',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        logout: function(successDo, errorDo){
            "use strict";
            httpBase.post({
                url: '/api/users/logout',
                successDo: successDo,
                errorDo: errorDo
            });
        },
        isLogin: function(){
            "use strict";
            return !!($('#userIsLogin').val() == 1);
        },
        getUser: function(cb){
            "use strict";
            var self = this;
            if(self.user){
                cb(self.user);
            }else {
                httpBase.get({
                    url: '/api/users/userInfo',
                    successDo: function(data){
                        self.user = data.user;
                        cb(self.user)
                    },
                    errorDo: function(){
                        cb();
                    }
                });
            }
        },
        update_password: function (params, successDo, errorDo, alwaysDo) {
          "use strict";
          httpBase.put({
              url: '/api/users/update_password',
              params: params,
              successDo: successDo,
              errorDo: errorDo,
              alwaysDo: alwaysDo
          });
        }
    }
}]);

services.factory('dic_hospitalHttp', ['httpBase', function(httpBase){
    return {
        getHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/dic_hospitals',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        createHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: '/api/dic_hospitals/new_hospital',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            });
        },
        editHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: '/api/dic_hospitals/edit_hospital',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            });
        },
        getOptionAttr: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/dic_hospitals/options_attr',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        getHospitalDevice: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/dic_hospitals/get_hospital_device',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        saveHospitalDevice: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: '/api/dic_hospitals/save_hospital_device',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        deleteHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/dic_hospitals/delete_hospital',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        }
    }
}]);

services.factory('projectHttp', ['httpBase', function(httpBase){
    return {
        getProjects: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/projects',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        addProject: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/projects/add_project',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        editProject: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.put({
                url: '/api/projects/edit_project',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        editBodies: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.put({
                url: '/api/projects/edit_bodies',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        getProjectOpenedCitiesHospitals: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/projects/project_opened_cities',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        }
    }
}]);

//citys http
services.factory('citiesHttp', ['httpBase', function(httpBase){
    return{
        getCities: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/cities',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        getOpenedCities: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/cities/opened',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        changeCities: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.put({
                url:'/api/cities',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        }
    }
}]);

//bodies http
services.factory('bodiesHttp', ['httpBase', function(httpBase){
    return{
        getBody: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/bodies',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        getBodyByProject: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/bodies/by_project',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        getCategory: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/categories',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        createBody: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/bodies/new_body',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        updateBody: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/bodies/update_body',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        deleteBody: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/bodies/delete',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        addProjectToBody: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/bodies/add_project',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        }
    }
}]);

//operationlogs http
services.factory('operationlogsHttp', ['httpBase', function(httpBase){
    return{
        getOperationlogs: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/operation_logs',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        getOperationlogtypes: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/operation_logs/types',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            });
        }
    }
}]);

//categories Http
services.factory('categoriesHttp', ['httpBase', function(httpBase){
    return{
        getCategories: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/categories',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        createCategory: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/categories/new_category',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        },
        deleteCategory: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url: '/api/categories/delete',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        },
        updateCategory: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.post({
                url: '/api/categories/update',
                params: params,
                successDo: successDo,
                errorDo: errorDo
            })
        }
    }
}]);

services.factory('bodyModesHttp', ['httpBase', function(httpBase){
    return{
        getBodyModes: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.get({
            url: '/api/body_modes',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        },
        createBodyMode: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.post({
            url: 'api/body_modes/create_body_mode',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        },
        editBodyModes: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.put({
            url: 'api/body_modes/edit_body_mode',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        },
        deleteBodyMode: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.get({
            url: 'api/body_modes/delete',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        }
    }
}]);

services.factory('hospitalHttp', ['httpBase', function(httpBase){
    return{
        getHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/hospitals',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        addHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: '/api/hospitals/add_hospital',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        editHospital: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: '/api/hospitals/edit_hospital',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        getHospitalProjects: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: '/api/hospitals/get_hospital_projects',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            })
        },
        addHospitalProjects: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: '/api/hospitals/add_hospital_projects',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        editHospitalProjects: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/edit_hospital_projects',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        editHospitalAssistants: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            if(params.hospital_assistant.id){
              httpBase.put({
                  url: 'api/hospitals/edit_hospital_assistants',
                  params:params,
                  successDo:successDo,
                  errorDo:errorDo,
                  alwaysDo:alwaysDo
              });
            }
        },
        deleteHospitalAssistants: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: 'api/hospitals/delete_hospital_assistants',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        addHospitalAssistants: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: 'api/hospitals/add_hospital_assistants',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
          },

        updateInspectionWorkflows: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: 'api/hospitals/update_inspection_workflows',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        getHospitalResources: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: 'api/hospitals/get_hospital_resources',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        editHospitalResources: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/edit_hospital_resources',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        getProjectRelations: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: 'api/hospitals/project_relations',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        editProjectRelations: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/edit_project_relations',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        editProjectRelationsMultiple: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/edit_project_relations_multiple',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        getCooperatingHospital: function (params, successDo, errorDo, alwaysDo) {
            "use strict";
            var self = this;
            httpBase.get({
                url: 'api/hospitals/get_cooperating_hospital',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        createHospitalProject: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.post({
                url: 'api/hospitals/create_hospital_device',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },

        editCooperatingHospital: function (params, successDo, errorDo, alwaysDo) {
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/edit_cooperating_hospital',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },

        updateHospitalProject: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.put({
                url: 'api/hospitals/update_hospital_device',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        },
        deleteHospitalDevice: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            var self = this;
            httpBase.get({
                url: 'api/hospitals/delete_hospital_device',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alwaysDo:alwaysDo
            })
        }

    }
}]);

services.factory('manageOrdersHttp', ['httpBase', function(httpBase){
    return{
        getOrderList: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.get({
            url: '/api/manage_orders/list',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        },
        getOptionAttr: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.get({
            url: '/api/manage_orders/get_option_attr',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        },
        getOrderDetail: function(params, successDo, errorDo, alwaysDo){
          "use strict";
          var self = this;
          httpBase.get({
            url: '/api/manage_orders/get_order_detail',
            params:params,
            successDo:successDo,
            errorDo:errorDo,
            alwaysDo:alwaysDo
          })
        }
    }
}]);
