define([
  "angular",
  "firebase",
  "angularRoute"
], function(angular, firebase, route) {
  angular
  .module("AminoApp.add", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/add", {
      templateUrl: "partials/add.html",
      controller: "addCtrl",
      controllerAs: "add"
    });
  }])
  .controller("addCtrl", ["$firebaseArray", "uid",
    function($firebaseArray, uid) {
      var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins/");
      var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos/");
      var users = new Firebase("https://proteinpanic.firebaseio.com/users/");
      var proteinArr = $firebaseArray(proteins);
      var aminoArr = $firebaseArray(aminos);
      var userArr = $firebaseArray(users);

      var userId = uid.getUid();

      // needs logged in admin check to display page
      
      this.addProtein = function() {
        var theName = this.proteinName;
        var theAminos = this.aminoString;
        var newProtein = {name: theName, sequence: theAminos};
        proteinArr.$add(newProtein);
        this.proteinName = "";
        this.aminoString = "";
      };

      this.addAmino = function() {
        var theName = this.aminoName;
        var theCode = this.aminoCode;
        var theCodons = this.codonString.split(", ");
        var newAmino = {name: theName, codons: theCodons, code: theCode};
        aminoArr.$add(newAmino);
        this.aminoName = "";
        this.aminoCode = "";
        this.codonString = "";
      };

      this.addEverything = function() {
        var ungodlyArray = [];
        var newProtein = {
          name: "",
          sequence: ""
        };
        console.log("clicky");
        $.ajax({
          url: "../assets/parsed.txt"
        }).done(function(data) {
          ungodlyArray = data.split("\n");
          for(var i = 0; i < ungodlyArray.length; i++) {
            var proteinComplete = false;
            if(newProtein.name === "" && !isSequence(ungodlyArray[i])) {
              newProtein.name = ungodlyArray[i];
            } else if(!isSequence(ungodlyArray[i])) {
              if(ungodlyArray[i].length < newProtein.name.length) {
                newProtein.name = ungodlyArray[i];
              }
            } else if(isSequence(ungodlyArray[i])) {
              newProtein.sequence = newProtein.sequence + ungodlyArray[i];
              if((i + 1) < ungodlyArray.length){
                if(!isSequence(ungodlyArray[i + 1])) {
                  proteinComplete = true;
                }
              } else {
                proteinComplete = true;
              }
            }
            if(newProtein.name !== "" && proteinComplete) {
              console.log("full protein:", newProtein);
              // proteinArr.$add(newProtein);
              newProtein.name = "";
              newProtein.sequence = "";
            }
          }
        });
      };

      var cannotHave = [ "J", "O", "-", "'", ".", "/", "[", "]", "(", ")", " ", ",", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

      function isSequence(str) {
        if(str.length > 60) {
          return false;
        }
        var upperStr = str.toUpperCase();
        for(var j = 0; j < cannotHave.length; j++) {
          if(upperStr.indexOf(cannotHave[j]) >= 0) {
            return false;
          }
        }
        return upperStr == str;
      }

    }
  ]);
});