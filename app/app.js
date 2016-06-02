define([
  "phaser",
  "angular",
  "bootstrap",
  "angularfire",
  "angularRoute",
  "angularFilter",
  "factories/uid",
  "factories/creator",
  "factories/preload",
  "controllers/addCtrl",
  "factories/menuSplash",
  "controllers/menuCtrl",
  "controllers/userCtrl",
  "controllers/gameCtrl",
  "controllers/loginCtrl",
  "controllers/statsCtrl",
  "factories/proteinPanic"
], function(phaser, angular, bootstrap, angularfire, angularRoute, filter, uid, userCreator, preload, add, menuSplash, menu, user, game, login, stats, proteinPanic) {
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
    "AminoApp.menuSplash",
    "AminoApp.userCreator",
    "AminoApp.proteinPanic"
  ]).
  config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/"});
  }]);
});
