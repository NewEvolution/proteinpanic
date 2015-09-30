define([
  "angular",
  "firebase",
  "bootstrap",
  "angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
  angular.module("AminoApp.stats", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/stats", {
      templateUrl: "../partials/stats.html",
      controller: "statsCtrl",
      controllerAs: "stats"
    });
  }])
  .controller("statsCtrl", ["$firebaseArray", "uid", "proteinPanic", "menuSplash", "preload",
  function($firebaseArray, uid, proteinPanic, menuSplash, preload) {
    
    var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var color = 0x00ff00;

    this.arrayOfUsers = usersArr;
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
            menuSplash.menusLoadedSetter(true);
            menuSplash.hasTitleSetter(false);
            menuSplash.trnaTintSetter(color);
            menuSplash.menuStarter();
          } else {
            menuSplash.hasTitleSetter(false);
            menuSplash.trnaTintSetter(color);
          }
        }
      }));
    }

    this.userRank = function(proteinString) {
      if(proteinString) {
        var rank = proteinString.split(",").length - 1;
        if(rank > 0) {
          return rank;
        }
      }
      return 0;
    };

    this.userColor = function(color) {
      return {"background-color": color};
    };

    this.mainMenu = function() {
      window.location = "#/menu";
    };

  }]);
});