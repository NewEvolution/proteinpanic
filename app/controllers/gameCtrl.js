define([
	"angular",
	"firebase",
	"bootstrap", 
	"angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
	angular.module("AminoApp.game", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "../partials/game.html",
			controller: "gameCtrl",
			controllerAs: "game"
		});
	}])
	.controller("gameCtrl", ["$firebaseArray", "uid", function($firebaseArray, uid) {

		var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
		var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
		var users = new Firebase("https://proteinpanic.firebaseio.com/users");
		var ref = new Firebase("https://proteinpanic.firebaseio.com");

		var proteinArr = $firebaseArray(proteins);
		var userArr = $firebaseArray(users);
		var currentUID;
		var username;

		var game = new Phaser.Game(1024, 576, Phaser.AUTO, "gameTarget");

		var authData = ref.getAuth();
		if(authData === null) {
			loginMenu();
			game.state.start("loginMenu");
		} else {
		  uid.setUid(authData.uid);
		  currentUID = authData.uid;
		  for (var i = 0; i < usersArr.length; i++) {
        if(usersArr[i].uid === currentUID) {
					username = usersArr[i].username;
          goTo = "game";
          break;
        } else {
          goTo = "username";
        }
      }
      if(goTo !== "") {
        game.state.start(goTo);
      }
		}


		function gameInit() {
			game.state.add("gameInit", {preload: preload});

			function preload() {
				game.load.image("background", "images/cell_bg.png");
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
			}

		}

		function loginMenu() {
			game.state.add("loginMenu", {preload: preload, create: create});

			var githubBtn;
			var googleBtn;
			var twitterBtn;
			var facebookBtn;

			function preload() {
				game.load.spritesheet("facebook-btn", "images/facebook-btn.png", 246, 42);
				game.load.spritesheet("twitter-btn", "images/twitter-btn.png", 246, 42);
				game.load.spritesheet("github-btn", "images/github-btn.png", 246, 42);
				game.load.spritesheet("google-btn", "images/google-btn.png", 246, 42);
				game.load.image("splash", "images/splash_screen.png");
				game.load.image("orline", "images/or_line.png");
			}

			function create(){
		    game.physics.startSystem(Phaser.Physics.ARCADE);

		    game.add.sprite(0, 0, "splash");
		    game.add.sprite(703,119, "orline");
		    facebookBtn = game.add.button(739, 168, "facebook-btn", facebookRedir, this, 0, 1, 2, 0);
		    twitterBtn = game.add.button(739, 265, "twitter-btn", twitterRedir, this, 0, 1, 2, 0);
		    githubBtn = game.add.button(739, 118, "github-btn", githubRedir, this, 0, 1, 2, 0);
		    googleBtn = game.add.button(739, 217, "google-btn", googleRedir, this, 0, 1, 2, 0);
		  }

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
        ref.authWithPassword({
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

      function facebookRedir() {
      	serviceAuth("facebook");
      }

      function twitterRedir() {
      	serviceAuth("twitter");
      }

      function githubRedir() {
      	serviceAuth("github");
      }

      function googleRedir() {
      	serviceAuth("google");
      }

		  function serviceAuth(service) {
        ref.authWithOAuthPopup(service, function(error, authData) {
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
              game.state.start(goTo);
            }
          }
        });
      }

		}
	}]);
});