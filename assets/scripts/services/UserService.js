angular.module('prod').factory('UserService', [function() {
   var sdo = {
      isLogged: false,
      username: ''
   };
   return sdo;
}]);