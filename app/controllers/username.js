define([
  "angular",
  "firebase",
  "angularRoute"
], function(angular, firebase, route) {
  angular
  .module("AminoApp.username", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/username", {
      templateUrl: "partials/username.html",
      controller: "usernameCtrl",
      controllerAs: "username"
    });
  }])
  .controller("usernameCtrl", ["$firebaseAuth", "$firebaseArray", "uid",
    function($firebaseAuth, $firebaseArray, uid) {
      var userRef = new Firebase("https://proteinpanic.firebaseio.com/users/");
      var usersArr = $firebaseArray(userRef);
      var currentUID = uid.getUid();

      this.checkAvail = function(choosing) {
        var usernameAvailable = false;
        for (var k = 0; k < usersArr.length; k++) {
          if(usersArr[k].username === this.username) {
            usernameAvailable = false;
            alert("I'm sorry, the username " + this.username + " is taken.");
            break;
          } else {
            usernameAvailable = true;
          }
        }
        if(usernameAvailable && choosing) {
          this.newUsername();
        } else if (usernameAvailable) {
          alert(this.username + " is available!");
        }
      };

      this.newUsername = function() {
        usersArr.$add({
          uid: currentUID,
          username: this.username
        });
        window.location = "#/game/";
      };

    }
  ]);
});