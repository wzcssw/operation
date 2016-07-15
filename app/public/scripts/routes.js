var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider..state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    }).state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerController'
    });
    $urlRouterProvider.otherwise('/login');
}]);
