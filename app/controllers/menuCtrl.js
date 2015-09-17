define([
	"angular",
	"firebase",
	"bootstrap",
	"angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
	angular.module("AminoApp.menu", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/menu", {
			templateUrl: "../partials/menu.html",
			controller: "menuCtrl",
			controllerAs: "menu"
		});
	}])
	.controller("menuCtrl", ["$firebaseArray", "uid", "proteinPanic", "preload",
	function($firebaseArray, uid, proteinPanic, preload) {
		
    var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var usersArr = $firebaseArray(users);
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

      var optionsBtn;
      var resumeBtn;
      var howtoBtn;
      var newBtn;

			function create(){
		    game.physics.startSystem(Phaser.Physics.ARCADE);

		    game.add.sprite(0, 0, "splash");
		    game.add.sprite(433, 38, "title");
		    newBtn = game.add.button(436, 123, "new_game", newFunc, this, 0, 1, 2, 0);
        resumeBtn = game.add.button(712, 123, "resume_game", resumeFunc, this, 0, 1, 2, 0);
        optionsBtn = game.add.button(436, 219, "options", optionsFunc, this, 0, 1, 2, 0);
        howtoBtn = game.add.button(712, 219, "how_to_play", howFunc, this, 0, 1, 2, 0);
		  }

      function resumeFunc() {
        window.location ="#/game";
      }

      function optionsFunc() {
        window.location ="#/user";
      }

      function howFunc() {
        window.location ="#/howto";
      }

      function newFunc() {
      	window.location ="#/game";
      }

		}

	}]);
});