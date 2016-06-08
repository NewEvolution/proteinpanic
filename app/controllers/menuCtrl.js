define([
	"angular",
	"angularRoute"
], function(angular, angularRoute) {
	angular.module("AminoApp.menu", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/menu", {
			templateUrl: "../partials/menu.html",
			controller: "menuCtrl",
			controllerAs: "menu"
		});
	}])
	.controller("menuCtrl", ["$firebaseArray", "uid", "userCreator", "proteinPanic", "menuSplash", "preload", "fireconf",
	function($firebaseArray, uid, userCreator, proteinPanic, menuSplash, preload, fireconf) {

    var game = proteinPanic;

    var ref = fireconf.database().ref();
    var users = ref.child("users");

    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var color = 0x00ff00;
    var promisedCreation;
    var music = 1;
    this.username = "";

    var authData = ref.getAuth();
    fireconf.auth().onAuthStateChanged(function(user) {
      if(user === null) {
        window.location = "/";
      } else {
        uid.setUid(user.uid);
        currentUID = user.uid;
        usersArr.$loaded().then(angular.bind(this, function(data) {
          var userDoesNotExist = true;
          for(var key in data) {
            if(data[key].uid === currentUID) {
              userDoesNotExist = false;
              music = data[key].music;
              this.username = data[key].username;
              color = "0x" + data[key].color.slice(1);
              menuSplash.volumeSetter(music);
            }
          }
          if(userDoesNotExist) {
            usersArr.$add(userCreator(currentUID));
          }
          if(this.username === "") {
            window.location = "#/user";
          } else {
            if(menuSplash.menusLoadedGetter() === false) {
              menuSplash.menusLoadedSetter(true);
              menuSplash.hasTitleSetter(true);
              menuSplash.trnaTintSetter(color);
              promisedCreation = menuSplash.menuStarter();
              promisedCreation.then(function() {
                menuSplash.volumeSetter(music);
                create();
              });
            } else {
              menuSplash.hasTitleSetter(true);
              menuSplash.trnaTintSetter(color);
              menuSplash.volumeSetter(music);
              create();
            }
          }
        }));
      }
    });

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
      menuSplash.musicStopper();
      game.state.remove("allMenus");
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
