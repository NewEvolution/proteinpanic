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
    this.deleteToggle = false;
    this.emailToggle = false;
    this.passToggle = false;
    this.emailAuth = false;
    this.color = "#00ff00";
    this.newPassword = "";
    this.effects = 100;
    this.username = "";
    this.password = "";
    this.newEmail = "";
    this.radioVal = "";
    this.intro = true;
    this.mouse = true;
    this.music = 100;
    this.email = "";

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
            this.effects = data[key].effects;
            this.mouse = data[key].mouse;
            this.music = data[key].music;
            this.color = data[key].color;
            this.intro = data[key].intro;
            if(currentUID.indexOf("github") === -1 && 
            currentUID.indexOf("facebook") === -1 && 
            currentUID.indexOf("twitter") === -1 && 
            currentUID.indexOf("google") === -1) {
              this.emailAuth = true;
            }
					}
				}
        userMenu();
			}));
		}

		function userMenu() {
			game.state.add("userMenu", {preload: preload, create: create});
      game.state.start("userMenu");

	    function create() {
	      game.physics.startSystem(Phaser.Physics.ARCADE);
	      game.add.sprite(0, 0, "splash");
	    }
		}

		this.checkAvail = function(saving) {
      var usernameAvailable = false;
      for(var k = 0; k < usersArr.length; k++) {
        if(this.username === "") {
          alert("Usernames cannot be blank.");
          break;
        } else if(usersArr[k].username === this.username && usersArr[k].uid === currentUID) {
          if(!saving) {
            alert(this.username + " is already your username...");
            break;
          } else {
            usernameAvailable = true;
            break;
          }
        }
        else if(usersArr[k].username === this.username) {
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
      usersObj[currentKey].effects = parseInt(this.effects);
      usersObj[currentKey].music = parseInt(this.music);
      usersObj[currentKey].username = this.username;
      usersObj[currentKey].mouse = this.mouse;
      usersObj[currentKey].color = this.color;
      usersObj[currentKey].intro = this.intro;
      usersObj.$save().then(function(ref) {
        alert("User data saved sucessfully!");
      });
    };

    this.mainMenu = function() {
      window.location = "#/menu";
    };

    this.changeEmail = function() {
      ref.changeEmail({
        oldEmail: this.email,
        newEmail: this.newEmail,
        password: this.password
      }, function(error) {
        if (error === null) {
          alert("Email changed successfully!");
        } else {
          alert("Error changing email:", error);
        }
      });
    };

    this.changePassword = function() {
      ref.changePassword({
        email: this.email,
        oldPassword: this.password,
        newPassword: this.newPassword
      }, function(error) {
        if (error === null) {
          alert("Password changed successfully!");
        } else {
          alert("Error changing password:", error);
        }
      });
    };

    this.removeUser = function() {
      ref.removeUser({
        email: this.email,
        password: this.password
      }, function(error) {
        if (error === null) {
          alert("Account deleted successfully! Sorry to see you go.");
        } else {
          alert("Error deleting account:", error);
        }
      });
    };

    this.radioChange = function() {
      if(this.radioVal === "email") {
        this.emailToggle = true;
        this.passToggle = false;
        this.deleteToggle = false;
      } else if(this.radioVal === "pass") {
        this.emailToggle = false;
        this.passToggle = true;
        this.deleteToggle = false;
      } else if(this.radioVal === "delete") {
        this.emailToggle = false;
        this.passToggle = false;
        this.deleteToggle = true;
      }
    };

	}]);
});