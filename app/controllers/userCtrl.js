define([
	"angular",
	"firebase",
	"bootstrap",
	"angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
	angular.module("AminoApp.user", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/user", {
			templateUrl: "../partials/user.html",
			controller: "userCtrl",
			controllerAs: "user"
		});
	}])
	.controller("userCtrl", ["$firebaseArray", "$firebaseObject", "uid", "proteinPanic", "preload",
	function($firebaseArray, $firebaseObject, uid, proteinPanic, preload) {

		var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");

    var usersArr = $firebaseArray(users);
    var usersObj = $firebaseObject(users);
    var currentUID = null;
    var currentKey = null;
    this.username = "";
    this.color = "#00ff00";

		var authData = ref.getAuth();
		if(authData === null) {
      window.location = "#/";
		} else {
		  uid.setUid(authData.uid);
		  currentUID = authData.uid;
			usersArr.$loaded().then(angular.bind(this, function(data) {
				for(var key in data) {
					if(data[key].uid === currentUID) {
            currentKey = data[key].$id;
						this.username = data[key].username;
					}
				}
        userMenu();
			}));
		}

		function userMenu() {
			game.state.add("userMenu", {preload: preload, create: create});
      game.state.start("userMenu");

	    function create(){
	      game.physics.startSystem(Phaser.Physics.ARCADE);
	      game.add.sprite(0, 0, "splash");
	    }
		}

		this.checkAvail = function(saving) {
      var usernameAvailable = false;
      for (var k = 0; k < usersArr.length; k++) {
        if(this.username === "") {
          alert("Usernames cannot be blank.");
          break;
        } else if(usersArr[k].username === this.username) {
          usernameAvailable = false;
          alert("I'm sorry, the username " + this.username + " is taken.");
          break;
        } else {
          usernameAvailable = true;
        }
      }
      if(usernameAvailable && saving) {
        this.saveUserData();
      } else if (usernameAvailable) {
        alert(this.username + " is available!");
      }
    };

    this.saveUserData = function() {
      usersObj[currentKey].username = this.username;
      usersObj[currentKey].color = this.color;
      usersObj.$save().then(function(ref) {
        alert("User data saved sucessfully!");
      });
    };

	}]);
});