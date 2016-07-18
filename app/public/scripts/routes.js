var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider.state('main', {
        url:'/register',
        templateUrl:'templates/main.html',
        controller:'mainController'
    }).state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    }).state('visit_records', {
        url:'/visit_records',
        templateUrl:'templates/visit_records.html',
        controller:'visitRecordsController'
    }).state('feedbacks', {
        url:'/feedbacks',
        templateUrl:'templates/feedbacks.html',
        controller:'feedbacksController'
    });
    $urlRouterProvider.otherwise('/login');
}]);
