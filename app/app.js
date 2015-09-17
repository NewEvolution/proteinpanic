define([
  "phaser",
  "angular",
  "bootstrap",
  "angularfire",
  "angularRoute",
  "angularFilter",
  "factories/uid",
  "controllers/add",
  "factories/preload",
  "controllers/menuCtrl",
  "controllers/userCtrl",
  "controllers/loginCtrl",
  "controllers/howtoCtrl",
  "factories/proteinPanic",
], function(phaser, angular, bootstrap, angularfire, angularRoute, filter, uid, add, preload, menu, user, login, howto, proteinPanic) {
  return angular.module("AminoApp", [
    "ngRoute",
    "firebase",
    "AminoApp.uid",
    "AminoApp.add",
    "AminoApp.menu",
    "AminoApp.user",
    "AminoApp.login",
    "AminoApp.howto",
    "angular.filter",
    "AminoApp.preload",
    "AminoApp.proteinPanic"
  ]).
  config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/"});
  }]);
});