/**
 * To enable a hamburger icon in resized screen.
 */
$(document).ready(function() {
    $(".button-collapse").sideNav();
    /*
    $(".button-collapse").sideNav(
        {
            menuWidth: 240, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );
    */
    console.log("loaded settings");
});


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
        .when('/login', {
            templateUrl : 'views/pages/login.html',
            controller : 'LoginCtrl as loginCtrl'
        })
        .otherwise({
            redirectTo : '/'
        });

}]);
