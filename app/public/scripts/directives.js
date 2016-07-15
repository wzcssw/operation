var directives = angular.module('directives', ['angular-loading-bar']);
directives.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
directives.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
}]);
directives.directive('afterRender', [ '$timeout', function($timeout) {
    return function(scope, element, attrs) {
        $timeout(function(){
            if(scope.$last) {
                if (attrs) {
                    scope.$eval(attrs.afterRender);
                }
            }
        });
    };
}]);
