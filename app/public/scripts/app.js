var app = angular.module('myApp', ['ui.bootstrap', 'routes', 'controllers', 'filters','angular-confirm']);
app.run(['$rootScope', '$location', '$state', 'userHttp', function($rootScope, $location, $state, userHttp){
    $rootScope.logout = function(){
        "use strict";
        userHttp.logout(function(){
            location.href = '/';
        });
    };

    $rootScope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if (!userHttp.isLogin() && !$location.$$path.match('login')){
            event.preventDefault();
            $state.go('login');
        }
    });

}]);
