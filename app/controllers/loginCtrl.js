define([
	"angular",
	"angularRoute"
], function(angular, angularRoute) {
	angular.module("AminoApp.login", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "../partials/login.html",
			controller: "loginCtrl",
			controllerAs: "login"
		});
	}])
	.controller("loginCtrl", ["$scope", "$firebaseArray", "uid", "userCreator", "proteinPanic", "menuSplash", "fireconf",
	function($scope, $firebaseArray, uid, userCreator, proteinPanic, menuSplash, fireconf) {

  	var game = proteinPanic;

    var ref = fireconf.database().ref();
    var users = ref.child("users");

    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var promisedCreation;
    this.passReset = false;
    this.username = "";

    fireconf.auth().onAuthStateChanged(function(user) {
      if(user === null) {
        if(menuSplash.menusLoadedGetter() === false) {
          menuSplash.menusLoadedSetter(true);
          menuSplash.hasTitleSetter(true);
          promisedCreation = menuSplash.menuStarter();
          promisedCreation.then(function() {
            create();
          });
        } else {
          menuSplash.hasTitleSetter(true);
          create();
        }
      } else {
        uid.setUid(user.uid);
        currentUID = user.uid;
        usersArr.$loaded().then(angular.bind(this, function(data) {
          var userDoesNotExist = true;
          for(var key in data) {
            if(data[key].uid === currentUID) {
              userDoesNotExist = false;
              this.username = data[key].username;
            }
          }
          if(userDoesNotExist) {
            usersArr.$add(userCreator(currentUID));
          }
          if(this.username === "") {
            window.location = "#/user";
          } else {
            window.location = "#/menu";
          }
        }));
      }
    }.bind(this));

    var githubBtn;
    var facebookBtn;
    var googleBtn;
    var twitterBtn;
    var orline;

		function create() {
      menuGroup = game.add.group();
      menuGroup.name = "menuGroup";
      menuGroup.fixedToCamera = true;
      orline = menuGroup.create(697, 119, "orline");
      githubBtn = game.add.button(827, 430, "github-btn", githubRedir, this, 0, 1, 2, 0);
      facebookBtn = game.add.button(827, 480, "facebook-btn", facebookRedir, this, 0, 1, 2, 0);
      googleBtn = game.add.button(827, 529, "google-btn", googleRedir, this, 0, 1, 2, 0);
      twitterBtn = game.add.button(827, 577, "twitter-btn", twitterRedir, this, 0, 1, 2, 0);
    }

    function facebookRedir() {
    	serviceAuth("Facebook");
    }

    function twitterRedir() {
    	serviceAuth("Twitter");
    }

    function githubRedir() {
    	serviceAuth("Github");
    }

    function googleRedir() {
    	serviceAuth("Google");
    }

	  function serviceAuth(service) {
      var provider = new fireconf.auth[service + "AuthProvider"]();
      fireconf.auth().signInWithRedirect(provider);
    }

	  this.signUp = function() {
	  	if(this.email === undefined || this.email.indexOf("@") === -1 || this.password.length < 6) {
	  		alert("You must provide a valid email address & a 6-character minimum password.");
	  	} else {
        fireconf.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .catch(function(error) {
            alert("Error creating user:\n" + error.message);
          }
        );
	    }
    };

    this.logIn = function() {
	  	if(this.email === undefined || this.email.indexOf("@") === -1 || this.email.indexOf(".") === -1 || this.password.length < 6) {
	  		alert("You must provide a valid email address & password.");
	  	} else {
        fireconf.auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .catch(function(error) {
            alert("Login Failed!\n" + error.message);
            if(error.code === "auth/wrong-password") {
              this.passReset = true;
              $scope.$digest();
            }
          }
        );
	    }
    };

    this.resetPass = function() {
      fireconf.auth().sendPasswordResetEmail(this.email).then(function() {
        alert("Password reset email sent successfully!");
      }, function(error) {
        alert("Error sending password reset email:\n" + error);
      });
    };

	}]);
});
