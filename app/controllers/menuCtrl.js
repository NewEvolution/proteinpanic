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

      var startBtn;
      var optionsBtn;
      var statsBtn;

			function create(){
		    game.physics.startSystem(Phaser.Physics.ARCADE);

		    game.add.sprite(0, 0, "splash");
		    game.add.sprite(433, 38, "title");
        startBtn = game.add.button(432, 110, "start_game", startFunc, this, 0, 1, 2, 0);
        optionsBtn = game.add.button(432, 177, "edit_options", optionsFunc, this, 0, 1, 2, 0);
        statsBtn = game.add.button(432, 245, "view_statistics", statsFunc, this, 0, 1, 2, 0);
		  }

      function startFunc() {
        window.location ="#/game";
      }

      function optionsFunc() {
        window.location ="#/user";
      }

      function statsFunc() {
      	window.location ="#/stats";
      }

		}

	}]);
});