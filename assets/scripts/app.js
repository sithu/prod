angular.module('prod', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ngSanitize'
]).config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl : 'views/pages/home.html',
            controller  : 'HomeCtrl as homeCtrl'
        })
        .when('/new_order', {
            templateUrl : 'views/pages/new_order.html',
            controller  : 'OrderCtrl as orderCtrl'
        })
        .otherwise({
            redirectTo : '/'
        });

}]);

