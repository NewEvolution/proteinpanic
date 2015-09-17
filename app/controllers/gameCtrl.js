define([
	"angular",
	"firebase",
	"bootstrap",
	"angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
	angular.module("AminoApp.game", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/game", {
			templateUrl: "../partials/game.html",
			controller: "gameCtrl",
			controllerAs: "game"
		});
	}])
	.controller("gameCtrl", ["$firebaseArray", "uid", "proteinPanic", "preload",
	function($firebaseArray, uid, proteinPanic, preload) {

		var users = new Firebase("https://proteinpanic.firebaseio.com/users");
		var ref = new Firebase("https://proteinpanic.firebaseio.com");
		var usersArr = $firebaseArray(users);
		var game = proteinPanic;
    var currentUID = null;
    this.username = "";

    var authData = ref.getAuth();
    if(authData === null) {
      window.location = "/";
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
          usersArr.$add({uid: currentUID});
        }
        if(this.username === "") {
          window.location = "#/user";
        } else {
          mainMenu();
        }
      }));
    }

		function mainMenu() {
			game.state.add("mainMenu", {preload: preload, create: create});
      game.state.start("mainMenu");

			var githubBtn;
			var googleBtn;
			var twitterBtn;
			var facebookBtn;

			function create(){
		    game.physics.startSystem(Phaser.Physics.ARCADE);

		    game.add.sprite(0, 0, "splash");
		    game.add.sprite(433, 38, "title");
		    facebookBtn = game.add.button(739, 168, "facebook-btn", facebookRedir, this, 0, 1, 2, 0);
		    twitterBtn = game.add.button(739, 265, "twitter-btn", twitterRedir, this, 0, 1, 2, 0);
		    githubBtn = game.add.button(739, 118, "github-btn", githubRedir, this, 0, 1, 2, 0);
		    googleBtn = game.add.button(739, 217, "google-btn", googleRedir, this, 0, 1, 2, 0);
		  }

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
        ref.authWithOAuthRedirect(service, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          }
        });
      }

		}

	}]);
});