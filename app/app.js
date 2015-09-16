define([
  "phaser",
  "angular",
  "bootstrap",
  "angularfire",
  "angularRoute",
  "angularFilter",
  "factories/uid",
  "controllers/add",
  "factories/mainMenu",
  "controllers/gameCtrl",
  "controllers/userCtrl",
  "controllers/loginCtrl",
  "factories/proteinPanic",
], function(phaser, angular, bootstrap, angularfire, angularRoute, filter, uid, add, mainMenu, game, user, login, proteinPanic) {
  return angular.module("AminoApp", [
    "ngRoute",
    "firebase",
    "AminoApp.uid",
    "AminoApp.add",
    "AminoApp.game",
    "AminoApp.user",
    "AminoApp.login",
    "angular.filter",
    "AminoApp.mainMenu",
    "AminoApp.proteinPanic"
  ]).
  config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/"});
  }]);
});