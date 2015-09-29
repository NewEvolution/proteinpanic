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
	.controller("menuCtrl", ["$firebaseArray", "uid", "proteinPanic", "menuSplash", "preload",
	function($firebaseArray, uid, proteinPanic, menuSplash, preload) {
		
    var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var color = 0x00ff00;
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
            color = "0x" + data[key].color.slice(1);
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
			game.state.add("mainMenu", {preload: preload, create: create, update: update});
      game.state.start("mainMenu");

			function create(){
        menuSplash.create(true);
        game.add.button(520, 422, "start-game", startFunc, this, 0, 1, 2, 0);
        game.add.button(520, 489, "edit-options", optionsFunc, this, 0, 1, 2, 0);
        game.add.button(520, 557, "view-statistics", statsFunc, this, 0, 1, 2, 0);
		  }

      function update() {
        menuSplash.update(true, color);
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