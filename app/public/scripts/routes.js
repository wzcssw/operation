var routes = angular.module('routes', ['ui.router']);
routes.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider.state('main', {
        url:'/main',
        templateUrl:'templates/main.html',
        controller:'mainController'
    }).state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginController'
    }).state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerController'
    }).state('dic_hospitals', {
        url:'/dic_hospitals',
        templateUrl:'templates/dic_hospitals.html',
        controller:'dicHospitalsController'
    }).state('new_hospital', {
        url:'/new_hospital',
        templateUrl:'templates/new_hospital.html',
        controller:'newHospitalController'
    }).state('projects', {
        url:'/projects',
        templateUrl:'templates/projects.html',
        controller:'projectsController'
    }).state('cities',{
        url:'/cities',
        templateUrl:'templates/cities.html',
        controller:'citiesController'
    }).state('operation_logs',{
        url:'/operation_logs',
        templateUrl:'templates/operation_logs.html',
        controller:'operationlogsController'
    }).state('body_modes',{
        url:'/body_modes',
        templateUrl:'templates/body_modes.html',
        controller:'bodyModesController'
    }).state('hospitals',{
        url:'/hospitals',
        templateUrl:'templates/hospitals.html',
        controller:'hospitalsController'
    }).state('manage_orders',{
        url:'/manage_orders',
        templateUrl:'templates/manage_orders.html',
        controller:'manageOrdersController'
    });
    $urlRouterProvider.otherwise('/login');
}]);
