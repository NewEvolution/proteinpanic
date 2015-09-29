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
	.controller("loginCtrl", ["$scope", "$firebaseArray", "uid", "proteinPanic", "preload",
	function($scope, $firebaseArray, uid, proteinPanic, preload) {
	
  	var game = proteinPanic;

    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
  
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    this.passReset = false;
    this.username = "";


    var authData = ref.getAuth();
    if(authData === null) {
  		loginMenu();
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
					window.location = "#/menu";
				}
			}));
		}

		function loginMenu() {
			game.state.add("loginMenu", {preload: preload, create: create, update: update});
      game.state.start("loginMenu");

      var allAminos = ["D", "E", "F", "N", "I", "M", "W", "Q", "H", "T", "R", "C", "Y", "A", "G", "L", "P", "K", "S", "V"];

      var valinePoints = {
        x: [57, 57, 67, 67, 57],
        y: [70, 80, 80, 70, 70]
      };
      var valineRotating = false;
      var valinePath = [];
      var valineStep = 0;
      var valRot = 0;

      var argininePoints = {
        x: [725, 745, 725, 705, 725],
        y: [485, 505, 525, 505, 485]
      };
      var arginineRotating = false;
      var argininePath = [];
      var arginineStep = 0;
      var argRot = 0;

      var facebookBtn;
      var twitterBtn;
      var aminoGroup;
      var panicGroup;
      var githubBtn;
      var googleBtn;
      var menuGroup;
      var arginine;
      var trnaEyes;
      var valine;
      var trna;

			function create() {
		    game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1200, 1200);
        game.add.tileSprite(0, 0, 1200, 1200, "background");
        game.camera.x = (game.world.width - game.camera.width) / 2;
        game.camera.y = (game.world.height - game.camera.height) / 2;

        // Floating amino block ###################################################################
        aminoGroup = game.add.group();
        aminoGroup.name = "aminoGroup";
        aminoGroup.enableBody = true;
        for (var i = 0; i < 15; i++) {
          var aminoX = game.world.randomX;
          var aminoY = game.world.randomY;
          var theAmino = game.rnd.pick(allAminos);
          var anAmino = aminoGroup.create(aminoX, aminoY, theAmino);
          anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
          anAmino.body.collideWorldBounds = true;
          anAmino.anchor.setTo(0.5, 0.5);
        }

        // Background block #######################################################################
        menuGroup = game.add.group();
        menuGroup.name = "menuGroup";
        menuGroup.fixedToCamera = true;
        menuGroup.create(0, 18, "splash-ribo");

        // Valine
        valine = menuGroup.create(57, 70, "splash-valine");
        valine.anchor.setTo(0.5, 0.5);
        for (var vi = 0; vi <= 1; vi += 0.005) {
            var vx = this.math.catmullRomInterpolation(valinePoints.x, vi);
            var vy = this.math.catmullRomInterpolation(valinePoints.y, vi);
            valinePath.push( { x: vx, y: vy });
        }

        // Arginine
        arginine = menuGroup.create(725, 485, "splash-arginine");
        arginine.anchor.setTo(0.5, 0.5);
        for (var ai = 0; ai <= 1; ai += 0.002) {
            var ax = this.math.catmullRomInterpolation(argininePoints.x, ai);
            var ay = this.math.catmullRomInterpolation(argininePoints.y, ai);
            argininePath.push( { x: ax, y: ay });
        }

        trna = menuGroup.create(170, -27, "splash-trna");
        trna.tint = 0x00FF00;
        trnaEyes = menuGroup.create(65, 90, "splash-trna-eyes");
        trna.addChild(trnaEyes);

        // Menu block #############################################################################
        menuGroup.create(703, 119, "orline");
        menuGroup.create(433, 38, "title");
        game.add.button(827, 430, "github-btn", githubRedir, this, 0, 1, 2, 0);
        game.add.button(827, 480, "facebook-btn", facebookRedir, this, 0, 1, 2, 0);
        game.add.button(827, 529, "google-btn", googleRedir, this, 0, 1, 2, 0);
        game.add.button(827, 577, "twitter-btn", twitterRedir, this, 0, 1, 2, 0);
        panicGroup = game.add.group();
        menuGroup.addChild(panicGroup);
        panicGroup.create(728, 38, "panic-p");
        panicGroup.create(773, 38, "panic-a");
        panicGroup.create(835, 38, "panic-n");
        panicGroup.create(893, 38, "panic-i");
        panicGroup.create(917, 38, "panic-c");
      }

      function update() {
        // Aminos on stage management #############################################################
        game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);
        aminoGroup.forEachAlive(function(liveAmino) {
          // If an amino is going too slow, speed it up
          if(Math.abs(liveAmino.body.velocity.x) < 40 || Math.abs(liveAmino.body.velocity.y) < 40) {
            liveAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          }
          // Make sure the amino is facing the diretion it's traveling
          if(liveAmino.body.velocity.x > 0) {
            liveAmino.frame = 1;
          } else if(liveAmino.body.velocity.x < 0) { 
            liveAmino.frame = 0;
          }
        });

        // Valine movement ########################################################################
        valine.x = valinePath[valineStep].x;
        valine.y = valinePath[valineStep].y;
        valineStep++;
        if(valineStep >= valinePath.length) {
          valineStep = 0;
        }
        if(!valineRotating) {
          valineRotating = true;
          valRot = (game.rnd.integerInRange(0, 500) / 1000); // JavaScript & floating points do NOT get along nicely
        }
        if(valine.rotation < valRot) {
          valine.rotation = (Math.round((valine.rotation + 0.001) * 1000)) / 1000; // See above
        } else if(valine.rotation > valRot) {
          valine.rotation = (Math.floor((valine.rotation - 0.001) * 1000)) / 1000; // Ditto
        } else {
          valineRotating = false;
        }

        // Arginine movement ######################################################################
        arginine.x = argininePath[arginineStep].x;
        arginine.y = argininePath[arginineStep].y;
        arginineStep++;
        if(arginineStep >= argininePath.length) {
          arginineStep = 0;
        }
        if(!arginineRotating) {
          arginineRotating = true;
          argRot = (game.rnd.integerInRange(-700, 0) / 1000); // JavaScript & floating points do NOT get along nicely
        }
        if(arginine.rotation < argRot) {
          arginine.rotation = (Math.round((arginine.rotation + 0.001) * 1000)) / 1000; // See above
        } else if(arginine.rotation > argRot) {
          arginine.rotation = (Math.floor((arginine.rotation - 0.001) * 1000)) / 1000; // Ditto
        } else {
          arginineRotating = false;
        }

        // Panic vibration ########################################################################
        panicGroup.forEachExists(function(letter) {
          var anchors = {p: 728, a: 773, n: 835, i: 893, c: 917, y: 38};
          for(var keyName in anchors) {
            if(letter.key === "panic-" + keyName) {
              letter.x = game.rnd.realInRange((anchors[keyName] - 2),(anchors[keyName] + 2));
            }
            letter.y = game.rnd.realInRange((anchors.y - 2),(anchors.y + 2));
            letter.rotation = game.rnd.realInRange(-0.05, 0.05);
          }
        });

      }

      function rotateBoth(item1, item2) {
        item1.rotation = game.rnd.realInRange(-0.2, 0.2);
        item2.rotation = game.rnd.realInRange(-0.2, 0.2);
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