define([
  "phaser",
  "angular",
  "bootstrap",
  "angularfire",
  "angularRoute",
  "angularFilter",
  "factories/uid",
  "controllers/add",
  "controllers/auth",
  "controllers/username",
  "controllers/gameCtrl",
], function(phaser, angular, bootstrap, angularfire, angularRoute, filter, uid, add, auth, username, gameCtrl) {
  return angular.module("AminoApp", [
    "ngRoute",
    "firebase",
    "AminoApp.uid",
    "AminoApp.add",
    "AminoApp.auth",
    "AminoApp.game",
    "angular.filter",
    "AminoApp.username"
  ]).
  config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/"});
  }]);
});