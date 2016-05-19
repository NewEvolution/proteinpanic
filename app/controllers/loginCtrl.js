define([
	"angular",
	"firebase",
	"bootstrap",
	"angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
	angular.module("AminoApp.login", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "../partials/login.html",
			controller: "loginCtrl",
			controllerAs: "login"
		});
	}])
	.controller("loginCtrl", ["$scope", "$firebaseArray", "uid", "userCreator", "proteinPanic", "menuSplash",
	function($scope, $firebaseArray, uid, userCreator, proteinPanic, menuSplash) {

  	var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");

    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var promisedCreation;
    this.passReset = false;
    this.username = "";

    var authData = ref.getAuth();
    if(authData === null) {
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
          usersArr.$add(userCreator(currentUID));
        }
				if(this.username === "") {
          window.location = "#/user";
				} else {
					window.location = "#/menu";
				}
			}));
		}
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
    	serviceAuth("facebook");
    }

    function twitterRedir() {
    	serviceAuth("twitter");
    }

    function githubRedir() {
    	serviceAuth("github");
    }

    function googleRedir() {
    	serviceAuth("google");
    }

	  function serviceAuth(service) {
      ref.authWithOAuthRedirect(service, function(error, authData) {
        if (error) {
          alert("Login Failed!\n" + error);
        }
      });
    }

	  this.signUp = function() {
	  	if(this.email === undefined || this.email.indexOf("@") === -1 || this.password.length < 6) {
	  		alert("You must provide a valid email address & a 6-character minimum password.");
	  	} else {
	      ref.createUser({
	        email: this.email,
	        password : this.password
	      }, function(error, userData) {
	        if (error) {
	          alert("Error creating user:\n" + error);
	        } else {
	          this.logIn();
	        }
	      }.bind(this));
	    }
    };

    this.logIn = function() {
	  	if(this.email === undefined || this.email.indexOf("@") === -1 || this.email.indexOf(".") === -1 || this.password.length < 6) {
	  		alert("You must provide a valid email address & a 6-character minimum password.");
	  	} else {
	      ref.authWithPassword({
	        email: this.email,
	        password: this.password
	      }, function(error, authData) {
	        if (error) {
	          alert("Login Failed!\n" + error);
            if(error.message === "The specified password is incorrect.") {
              this.passReset = true;
              $scope.$digest();
            }
	        } else {
	          currentUID = authData.uid;
	          uid.setUid(currentUID);
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
              orline.destroy();
              githubBtn.destroy();
              googleBtn.destroy();
              twitterBtn.destroy();
              facebookBtn.destroy();
              if(this.username === "") {
                window.location = "#/user";
              } else {
                window.location = "#/menu";
              }
            }));
	        }
	      }.bind(this));
	    }
    };

    this.resetPass = function() {
      ref.resetPassword({
        email: this.email
      }, function(error) {
        if (error === null) {
          alert("Password reset email sent successfully!");
        } else {
          alert("Error sending password reset email:\n" + error);
        }
      });
    };

	}]);
});
