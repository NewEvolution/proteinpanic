define([
  "phaser",
  "angular",
  "bootstrap",
  "angularfire",
  "angularRoute",
  "angularFilter",
  "factories/uid",
  "factories/preload",
  "controllers/addCtrl",
  "controllers/menuCtrl",
  "controllers/userCtrl",
  "controllers/gameCtrl",
  "controllers/loginCtrl",
  "controllers/statsCtrl",
  "factories/proteinPanic",
], function(phaser, angular, bootstrap, angularfire, angularRoute, filter, uid, preload, add, menu, user, game, login, stats, proteinPanic) {
  return angular.module("AminoApp", [
    "ngRoute",
    "firebase",
    "AminoApp.uid",
    "AminoApp.add",
    "AminoApp.menu",
    "AminoApp.user",
    "AminoApp.game",
    "AminoApp.login",
    "AminoApp.stats",
    "angular.filter",
    "AminoApp.preload",
    "AminoApp.proteinPanic"
  ]).
  config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/"});
  }]);
});