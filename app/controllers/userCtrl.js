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
	.controller("userCtrl", ["$firebaseArray", "$firebaseObject", "uid", "proteinPanic", "menuSplash", "preload",
	function($firebaseArray, $firebaseObject, uid, proteinPanic, menuSplash, preload) {

		var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");

    var usersArr = $firebaseArray(users);
    var usersObj = $firebaseObject(users);
    var currentUID = null;
    var currentKey = null;
    var promisedCreation;
    this.ribosomeMuted = false;
    this.deleteToggle = false;
    this.emailToggle = false;
    this.passToggle = false;
    this.emailAuth = false;
    this.color = "#00ff00";
    this.newPassword = "";
    this.checkpoint = 10;
    this.effects = 1.0;
    this.username = "";
    this.password = "";
    this.newEmail = "";
    this.radioVal = "";
    this.intro = true;
    this.mouse = true;
    this.music = 1.0;
    this.email = "";

		var authData = ref.getAuth();
		if(authData === null) {
      window.location = "#/";
		} else {
		  uid.setUid(authData.uid);
		  currentUID = authData.uid;
			usersArr.$loaded().then(angular.bind(this, function(data) {
        var userDoesNotExist = true;
        for(var key in data) {
          if(data[key].uid === currentUID) {
            userDoesNotExist = false;
            this.username = data[key].username;
          }
        }
        if(userDoesNotExist) {
          usersArr.$add({
            uid: currentUID,
            achievements: {
              epicCollections: 0,
              totalEpicCollections: 0,
              hiddenAminoAcids: 0,
              totalHiddenAminoAcids: 0,
              longWayHomes: 0,
              totalLongWayHomes: 0,
              cleanCollections: 0,
              totalCleanCollections: 0,
              quickCollections: 0,
              totalQuickCollections: 0
            },
            intro: true,
            checkpoint: 10,
            color: "#000000",
            effects: 1,
            music: 1,
            mouse: false,
            ribosomeMuted: false
          });
          window.location.reload();
        } else {
  				for(var anotherKey in data) {
  					if(data[anotherKey].uid === currentUID) {
              this.ribosomeMuted = data[anotherKey].ribosomeMuted;
              this.checkpoint = data[anotherKey].checkpoint;
              this.username = data[anotherKey].username;
              this.effects = data[anotherKey].effects;
              this.mouse = data[anotherKey].mouse;
              this.music = data[anotherKey].music;
              this.color = data[anotherKey].color;
              this.intro = data[anotherKey].intro;
              currentKey = data[anotherKey].$id;
              menuSplash.volumeSetter(this.music);
              menuSplash.trnaTintSetter("0x" + this.color.slice(1));
              if(currentUID.indexOf("github") === -1 && 
              currentUID.indexOf("facebook") === -1 && 
              currentUID.indexOf("twitter") === -1 && 
              currentUID.indexOf("google") === -1) {
                this.emailAuth = true;
              }
  					}
  				}
        }
        if(menuSplash.menusLoadedGetter() === false) {
          menuSplash.menusLoadedSetter(true);
          menuSplash.hasTitleSetter(false);
          promisedCreation = menuSplash.menuStarter();
          promisedCreation.then(angular.bind(this, function() {
            menuSplash.volumeSetter(this.music);
            menuSplash.trnaTintSetter("0x" + this.color.slice(1));
          }));
        } else {
          menuSplash.hasTitleSetter(false);
          menuSplash.volumeSetter(this.music);
          menuSplash.trnaTintSetter("0x" + this.color.slice(1));
        }
			}));
		}

    this.logOut = function() {
      ref.unauth();
      game.state.remove("theGame");
      window.location = "#/";
    };

		this.checkAvail = function(saving, destination) {
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
        this.saveUserData(destination);
      } else if (usernameAvailable) {
        alert(this.username + " is available!");
      }
    };

    this.colorChange = function() {
      menuSplash.trnaTintSetter("0x" + this.color.slice(1));
    };

    this.volumeChange = function() {
      menuSplash.volumeSetter(this.music);
    };

    this.saveUserData = function(destination) {
      usersObj[currentKey].checkpoint = parseInt(this.checkpoint);
      usersObj[currentKey].ribosomeMuted = this.ribosomeMuted;
      usersObj[currentKey].effects = parseFloat(this.effects);
      usersObj[currentKey].music = parseFloat(this.music);
      usersObj[currentKey].username = this.username;
      usersObj[currentKey].mouse = this.mouse;
      usersObj[currentKey].color = this.color;
      usersObj[currentKey].intro = this.intro;
      usersObj.$save().then(function(ref) {
        if(destination === "game") {
          menuSplash.musicStopper();
          game.state.remove("allMenus");
        }
        window.location = "#/" + destination;
      });
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