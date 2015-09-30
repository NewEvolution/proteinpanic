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
    var promisedCreation;
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
          if(menuSplash.menusLoadedGetter() === false) {
            console.log("Building from scratch");
            menuSplash.menusLoadedSetter(true);
            menuSplash.hasTitleSetter(true);
            menuSplash.trnaTintSetter(color);
            promisedCreation = menuSplash.menuStarter();
            promisedCreation.then(function() {
              create();
            });
          } else {
            console.log("Loading overtop");
            menuSplash.hasTitleSetter(true);
            menuSplash.trnaTintSetter(color);
            create();
          }
        }
      }));
    }

    var startBtn;
    var statsBtn;
    var editBtn;

		function create(){
      startBtn = game.add.button(520, 422, "start-game", startFunc, this, 0, 1, 2, 0);
      editBtn = game.add.button(520, 489, "edit-options", optionsFunc, this, 0, 1, 2, 0);
      statsBtn = game.add.button(520, 557, "view-statistics", statsFunc, this, 0, 1, 2, 0);
    }

    function btnKiller() {
      startBtn.destroy();
      editBtn.destroy();
      statsBtn.destroy();
    }

    function startFunc() {
      btnKiller();
      window.location ="#/game";
    }

    function optionsFunc() {
      btnKiller();
      window.location ="#/user";
    }

    function statsFunc() {
      btnKiller();
      window.location ="#/stats";
    }

	}]);
});