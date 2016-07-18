var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider.state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    }).state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerController'
    }).state('feedbacks', {
        url:'/feedbacks',
        templateUrl:'templates/feedbacks.html',
        controller:'feedbacksController'
    });
    $urlRouterProvider.otherwise('/login');
}]);
