define([
  "angular",
  "firebase",
  "angularRoute"
], function(angular, route, firebase) {
  angular
  .module("AminoApp.add", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/add", {
      templateUrl: "partials/add.html",
      controller: "addCtrl",
      controllerAs: "add"
    });
  }])
  .controller("addCtrl", ["$firebaseArray", "uid",
    function($firebaseArray, uid) {
      var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins/");
      var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos/");
      var users = new Firebase("https://proteinpanic.firebaseio.com/users/");
      var proteinArr = $firebaseArray(proteins);
      var aminoArr = $firebaseArray(aminos);
      var userArr = $firebaseArray(users);

      var userId = uid.getUid();

      // needs logged in admin check to display page
      
      this.addProtein = function() {
        var theName = this.proteinName;
        var theAminos = this.aminoString.split("-");
        var newProtein = {name: theName, sequence: theAminos};
        proteinArr.$add(newProtein);
        this.proteinName = "";
        this.aminoString = "";
      };

      this.addAmino = function() {
        var theName = this.aminoName;
        var theCode = this.aminoCode;
        var theCodons = this.codonString.split(", ");
        var newAmino = {name: theName, codons: theCodons, code: theCode};
        aminoArr.$add(newAmino);
        this.aminoName = "";
        this.codonString = "";
      };

    }
  ]);
});