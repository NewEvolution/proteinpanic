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
  .controller("statsCtrl", ["$firebaseArray", "uid", "userCreator", "proteinPanic", "menuSplash", "preload",
  function($firebaseArray, uid, userCreator, proteinPanic, menuSplash, preload) {

    var game = proteinPanic;

    var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");

    var proteinsArr;
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var color = 0x00ff00;
    var music = 1;

    if(storageAvailable("localStorage")) {
      if(localStorage.getItem("proteins")) {
        proteinsArr = JSON.parse(localStorage.proteins);
      } else {
        localStorage.clear();
        proteinsArr = $firebaseArray(proteins);
        proteinsArr.$loaded().then(function(proteinsData) {
          localStorage.proteins = JSON.stringify(proteinsArr);
        });
      }
    } else {
      proteinsArr = $firebaseArray(proteins);
    }

    this.arrayOfUsers = usersArr;
    this.username = "";

    if(proteinsArr.length !== 0) {
      this.proteinCount = proteinsArr.length;
    } else {
      proteinsArr.$loaded().then(angular.bind(this, function(data) {
        this.proteinCount = data.length;
      }));
    }

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
          usersArr.$add(userCreator(currentUID));
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

    function storageAvailable(type) {
      try {
        var storage = window[type],
          x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      }
      catch(e) {
        return false;
      }
    }

    this.completedCount = function(proteinString) {
      if(proteinString) {
        var count = proteinString.split(",").length - 1;
        if(count > 0) {
          return count;
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
