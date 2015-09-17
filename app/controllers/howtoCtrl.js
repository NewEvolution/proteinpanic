define([
  "angular",
  "firebase",
  "bootstrap",
  "angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
  angular.module("AminoApp.howto", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/howto", {
      templateUrl: "../partials/howto.html",
      controller: "howtoCtrl",
      controllerAs: "howto"
    });
  }])
  .controller("howtoCtrl", ["$firebaseArray", "uid", "proteinPanic", "preload",
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
          howtoMenu();
        }
      }));
    }

    function howtoMenu() {
      game.state.add("howtoMenu", {preload: preload, create: create});
      game.state.start("howtoMenu");

      function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, "splash");
      }

    }

    this.mainMenu = function() {
      window.location = "#/menu";
    };

  }]);
});