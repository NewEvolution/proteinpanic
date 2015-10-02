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

    var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var proteinArr = $firebaseArray(proteins);
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var color = 0x00ff00;
    var music = 1;

    this.arrayOfUsers = usersArr;
    this.username = "";

    proteinArr.$loaded().then(angular.bind(this, function(data) {
      this.proteinCount = data.length;
    }));

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
            music = data[key].music;
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
            menuSplash.volumeSetter(music);
            menuSplash.menuStarter();
          } else {
            menuSplash.hasTitleSetter(false);
            menuSplash.trnaTintSetter(color);
            menuSplash.volumeSetter(music);
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

    this.barWidth = function(color, completedProteins) {
      var widthPercentange = ((completedProteins / this.proteinCount) * 100) + "%";
      return {"background-color": color, width: widthPercentange};
    };

    this.userColor = function(color) {
      return {"background-color": color};
    };

    this.mainMenu = function() {
      window.location = "#/menu";
    };

  }]);
});