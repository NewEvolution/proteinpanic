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
	.controller("userCtrl", ["$firebaseArray", "$firebaseObject", "uid", "proteinPanic", "mainMenu",
	function($firebaseArray, $firebaseObject, uid, proteinPanic, mainMenu) {

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

	    function preload() {
	      game.load.spritesheet("player", "images/tRNA.png", 65, 70);
	      game.load.spritesheet("A", "images/Alanine.png", 60, 59);
	      game.load.spritesheet("R", "images/Arginine.png", 60, 52);
	      game.load.spritesheet("N", "images/Asparagine.png", 26, 60);
	      game.load.spritesheet("D", "images/Aspartic_acid.png", 60, 58);
	      game.load.spritesheet("C", "images/Cysteine.png", 60, 59);
	      game.load.spritesheet("E", "images/Glutamic_acid.png", 30, 60);
	      game.load.spritesheet("Q", "images/Glutamine.png", 60, 44);
	      game.load.spritesheet("G", "images/Glycine.png", 60, 57);
	      game.load.spritesheet("H", "images/Histidine.png", 59, 60);
	      game.load.spritesheet("I", "images/Isoleucine.png", 60, 59);
	      game.load.spritesheet("L", "images/Leucine.png", 59, 60);
	      game.load.spritesheet("K", "images/Lysine.png", 60, 44);
	      game.load.spritesheet("M", "images/Methionine.png", 43, 60);
	      game.load.spritesheet("F", "images/Phenylalanine.png", 60, 60);
	      game.load.spritesheet("P", "images/Proline.png", 60, 48);
	      game.load.spritesheet("S", "images/Serine.png", 39, 60);
	      game.load.spritesheet("T", "images/Threonine.png", 56, 60);
	      game.load.spritesheet("W", "images/Tryptophan.png", 60, 31);
	      game.load.spritesheet("Y", "images/Tyrosine.png", 60, 38);
	      game.load.spritesheet("V", "images/Valine.png", 60, 60);
	      game.load.image("splash", "images/splash_screen.png");
	    }

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