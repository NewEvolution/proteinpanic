define([
  "angular",
  "firebase",
  "angularRoute"
], function(angular, firebase, route) {
  angular
  .module("AminoApp.auth", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "partials/auth.html",
      controller: "authCtrl",
      controllerAs: "auth"
    });
  }])
  .controller("authCtrl", ["$firebaseAuth", "$firebaseArray", "uid",
    function($firebaseAuth, $firebaseArray, uid) {
      var authRef = new Firebase("https://aminos-anonymous.firebaseio.com/");
      var userRef = new Firebase("https://aminos-anonymous.firebaseio.com/users/");
      var usersArr = $firebaseArray(userRef);
      var currentUID = "";
      var goTo = "";

      this.signUp = function() {
        authRef.createUser({
          email: this.email,
          password : this.password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            alert("User account created! You may now log in.");
          }
        }.bind(this));
      };

      this.logIn = function() {
        authRef.authWithPassword({
          email: this.email,
          password: this.password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            currentUID = authData.uid;
            uid.setUid(currentUID);
            for (var i = 0; i < usersArr.length; i++) {
              if(usersArr[i].uid === currentUID) {
                goTo = "game";
                break;
              } else {
                goTo = "username";
              }
            }
            if(goTo !== "") {
              window.location = "#/" + goTo + "/";
            }
          }
        }.bind(this));
      };
      
      this.serviceAuth = function(service) {
        authRef.authWithOAuthPopup(service, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            currentUID = authData.uid;
            uid.setUid(currentUID);
            for (var i = 0; i < usersArr.length; i++) {
              if(usersArr[i].uid === currentUID) {
                goTo = "game";
                break;
              } else {
                goTo = "username";
              }
            }
            if(goTo !== "") {
              window.location = "#/" + goTo + "/";
            }
          }
        }.bind(this));
      };

    }
  ]);
});