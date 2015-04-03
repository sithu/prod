/**
 * To enable a hamburger icon in resized screen.
 */
$(document).ready(function() {
    $(".button-collapse").sideNav(
        {
            menuWidth: 210, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );
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
        .when('/products', {
            templateUrl : 'views/pages/products.html',
            controller  : 'ProductListCtrl as productListCtrl'
        })
        .when('/new_product', {
            templateUrl : 'views/pages/new_product.html',
            controller  : 'ProductCtrl as productCtrl'
        })
        .when('/raw_materials', {
            templateUrl : 'views/pages/raw_materials.html',
            controller  : 'RawMaterialListCtrl as rawMaterialListCtrl'
        })
        .when('/new_raw_material', {
            templateUrl : 'views/pages/new_raw_material.html',
            controller  : 'RawMaterialCtrl as rawMaterialCtrl'
        })
        .when('/login', {
            templateUrl : 'views/pages/login.html',
            controller : 'LoginCtrl as loginCtrl'
        })
        .otherwise({
            redirectTo : '/'
        });

}]);
