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

services.factory('visitRecordsHttp', ['httpBase', function(httpBase){
    return {
        getVisitRecords: function(params, successDo, errorDo, alwaysDo){
            httpBase.get({
                url: '/api/visit_records',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        }
    }
}]);


services.factory('feedbacksHttp', ['httpBase', function(httpBase){
    return {
        getFeedbacks: function(params, successDo, errorDo, alwaysDo){
            httpBase.get({
                url: '/api/feedbacks/get_feedbacks',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        },
        getClassify: function(params, successDo, errorDo, alwaysDo){
            httpBase.get({
                url: '/api/feedbacks/get_classify',
                params: params,
                successDo: successDo,
                errorDo: errorDo,
                alwaysDo: alwaysDo
            });
        }
    }
}]);

services.factory('citiesHttp', ['httpBase', function(httpBase){
    return{
        getOpenedCities: function(params, successDo, errorDo, alwaysDo){
            "use strict";
            httpBase.get({
                url:'/api/cities/opened',
                params:params,
                successDo:successDo,
                errorDo:errorDo,
                alawyDo:alwaysDo
            });
        }
    }
}]);
