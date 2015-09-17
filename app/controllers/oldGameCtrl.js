define([
	"angular",
	"angularRoute",
	"firebase",
	"bootstrap", 
], function(angular, angularRoute, firebase, bootstrap) {
	angular.module("AminoApp.game", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/game", {
			templateUrl: "../partials/game.html",
			controller: "gameCtrl",
			controllerAs: "game"
		});
	}])
	.controller("gameCtrl", ["$firebaseArray", "uid", function($firebaseArray, uid) {

		var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
		var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
		var users = new Firebase("https://proteinpanic.firebaseio.com/users");
		var ref = new Firebase("https://proteinpanic.firebaseio.com");

		var proteinArr = $firebaseArray(proteins);
		var userArr = $firebaseArray(users);
		var currentUID = uid.getUid();

		var authData = ref.getAuth();
		if(authData === null) {
		  window.location = "/";
		} else {
		  uid.setUid(authData.uid);
		  currentUID = authData.uid;
		}


		userArr.$loaded().then(angular.bind(this, function(data) {
			for(var key in data) {
				if(data[key].uid === currentUID) {
					this.username = data[key].username;
				}
			}
		}));
    
    var theOnlyProtein = [];
    var countHolder;
    var countText;
    var aminosRemaining;
		var player;
		var cursors;
		var music;
		var hitReact;
		var ping;
		var success;
		var frenemies;
		var sidebar;
		var sidebarIcons;
		var sidebarArray = [];
		var selection_box;
		var stateText;
		var spriteText;
    var gameProtein = snapshot.val();
    for (var key in gameProtein) {
      theOnlyProtein = gameProtein[key];
      sidebarArray = theOnlyProtein.sequence;
    }

		var game = new Phaser.Game(1024, 600, Phaser.AUTO, "gameTarget"); 

		function create() {
			aminosRemaining = sidebarArray.length;

	    music = game.add.audio('titletrk');
	    music.loop = true;
	    music.play();
	    
			hitReact = game.add.audio('hitReact');
			ping = game.add.audio('ping');
			success = game.add.audio('success');

			game.add.tileSprite(0, 0, 1200, 1200, "background");


			game.world.setBounds(0, 0, 1200, 1200);

			//  We"re going to be using physics, so enable the Arcade Physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);


			// The player and its settings
			player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
			player.anchor.setTo(0.5, 0.5); //so it flips around its middle

			//  We need to enable physics on the player
			game.physics.arcade.enable(player);

			player.body.collideWorldBounds = true;

			frenemies = game.add.group();

			selection_box = game.add.sprite(0, 0, "selection_box");
			selection_box.fixedToCamera = true;

			sidebarIcons = game.add.group();

			//  We will enable physics for any frenemy that is created in this group
			frenemies.enableBody = true;


			for (var i = 0; i < 20; i++) {
				var theAmino = "";
				if(i < 5) {
					theAmino = sidebarArray[i];
				} else {
					theAmino = game.rnd.pick(sidebarArray);
				}
				//  Create a frenemy inside of the "frenemies" group
				var frenemyX = 201;
				var frenemyY = 301;
				while((frenemyX > 200 && frenemyX < 1000) && (frenemyY > 300 && frenemyY < 900)) {
					frenemyX = game.rnd.integerInRange(0, 1200);
					frenemyY = game.rnd.integerInRange(0, 1200);
				}
				var frenemy = frenemies.create(frenemyX, frenemyY, theAmino);
				frenemy.anchor.setTo(0.5, 0.5); //so it flips around its middle
				frenemy.rotation = game.rnd.realInRange(-0.2, 0.2);
				frenemy.body.velocity.set(game.rnd.integerInRange(-300, 300), game.rnd.integerInRange(-300, 300), "spinner");
				frenemy.body.collideWorldBounds = true;
				frenemy.body.bounce.y = 0.6 + Math.random() * 0.35;
				frenemy.body.bounce.x = 0.6 + Math.random() * 0.35;
			}

				//  Our controls.
			cursors = game.input.keyboard.createCursorKeys();

			game.camera.follow(player);

			//Created a Sprite with fixedToCamera = true
			countHolder = game.add.sprite(0,0);
			countHolder.fixedToCamera = true;

			//addChild of my text at x:0, y:0
			countText = game.add.text(0,0,aminosRemaining + " Left!");
			countHolder.addChild(countText);

			//position the cameraOffset of my Sprite
			countHolder.cameraOffset.x = 140;
			countHolder.cameraOffset.y = 10;

			for (var k = 0; k < sidebarArray.length; k++) {
				var sidebar = sidebarIcons.create(10 + (70 * k), 10, sidebarArray[k]);
				sidebar.fixedToCamera = true;
				if (k > 1) {
            sidebarIcons.children[k].alpha = 0;
				}
				if (k === 1) {
					sidebarIcons.children[k].scale.x = 0.7;
					sidebarIcons.children[k].scale.y = 0.7;
				}
			}

			spriteText = game.add.sprite(0, 0);
      spriteText.fixedToCamera = true;
      spriteText.visible = false;
		}

		function update() {
			game.physics.arcade.collide(frenemies, frenemies, rotateBoth, null, this);

			game.physics.arcade.overlap(player, frenemies, checkFrenemy, null, this);

			//  Reset the players velocity (movement)
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
			player.frame = 0;

			if (cursors.left.isDown) {
				player.body.velocity.x = -300;
				player.frame = 1;
				player.scale.x = -1;
			} else if (cursors.right.isDown) {
				player.body.velocity.x = 300;
				player.frame = 1;
				player.scale.x = 1;
			}

			if (cursors.up.isDown) {
				player.body.velocity.y = -300;
				player.frame = 2;
			} else if (cursors.down.isDown) {
				player.body.velocity.y = 300;
				player.frame = 3;
			}

      function checkFrenemy (player, frenemy) {
		    // if (sidebarArray[sidebarArray.length] === frenemy.key) { // right-to-left sidebar
		    if (sidebarArray[0] === frenemy.key) { // left-to-right sidebar
          goodFrenemy(player, frenemy);
		    } else {
		    	badFrenemy(player, frenemy);
		    	hitReact.play();
		    }
      }

			function rotateBoth(item1, item2) {
				item1.rotation = game.rnd.realInRange(-0.2, 0.2);
				item2.rotation = game.rnd.realInRange(-0.2, 0.2);
			}

      function goodFrenemy (player, frenemy) {
        if(sidebarArray.length === 1) {
        	success.play();
        	stateText = game.add.text(300, 400, " YOU WON! \n Click to restart");
          spriteText.addChild(stateText);
          spriteText.visible = true;

      //the "click to restart" handler
        game.input.onTap.addOnce(create,this);
        } else {
		    	ping.play();
		    }
        // sidebarArray.splice(sidebarArray.length-1, 1); // right-to-left sidebar
        sidebarArray.splice(0, 1); // left-to-right sidebar
        frenemy.kill();
        countText.text = sidebarArray.length + " Left!";
	      // sidebarIcons.remove(sidebarIcons.children[sidebarArray.length], true, true); // right-to-left sidebar
	      sidebarIcons.removeAll(); // left-to-right sidebar
	      for (var m = 0; m < sidebarArray.length; m++) {
				  var sidebar = sidebarIcons.create(10 + (70 * m), 10, sidebarArray[m]);
				  sidebar.fixedToCamera = true;
				  if (m > 1) {
            sidebarIcons.children[m].alpha = 0;
				  }
				  if (m === 1) {
						sidebarIcons.children[m].scale.x = 0.7;
						sidebarIcons.children[m].scale.y = 0.7;
					}
			  }
      }

      function badFrenemy (player, frenemy) {
      	player.rotation++;
      	player.scale.x -= 0.1;
      	player.scale.y -= 0.1;
      	player.alpha -= 0.1;
      	setTimeout(function() {
      		player.kill();
      	}, (200));
      	stateText = game.add.text(300, 400, " GAME OVER \n Click to restart");
        spriteText.addChild(stateText);
        spriteText.visible = true;

      //the "click to restart" handler
        game.input.onTap.addOnce(create, this);
      }

			var aliveCount = 0;
			for (var l = 0; l < frenemies.children.length; l++) {
				if(frenemies.children[l].alive === true) {
					aliveCount++;
				}
				if(Math.abs(frenemies.children[l].body.velocity.x) < 40 || Math.abs(frenemies.children[l].body.velocity.y) < 40) {
					frenemies.children[l].body.velocity.set(game.rnd.integerInRange(-300, 300), game.rnd.integerInRange(-300, 300), "spinner");
				}
			}

			// Always keep 20 frenemies on screen
			if (aliveCount < 20) {
				var theAmino = sidebarArray[0];

				//  Create a frenemy inside of the "frenemies" group
				var frenemyX = 201;
				var frenemyY = 301;
				while((frenemyX > player.x - 100 && frenemyX < player.x + 100) && (frenemyY > player.y - 100 && frenemyY < player.y + 100)) {
					frenemyX = game.rnd.integerInRange(0, 1200);
					frenemyY = game.rnd.integerInRange(0, 1200);
				}
				var frenemy = frenemies.create(frenemyX, frenemyY, theAmino);
				frenemy.anchor.setTo(0.5, 0.5); //so it flips around its middle
				frenemy.rotation = game.rnd.realInRange(-0.2, 0.2);

				frenemy.body.velocity.set(game.rnd.integerInRange(-300, 300), game.rnd.integerInRange(-300, 300), "spinner");

				frenemy.body.collideWorldBounds = true;

				frenemy.body.bounce.y = 0.6 + Math.random() * 0.35;
				frenemy.body.bounce.x = 0.6 + Math.random() * 0.35;
			}

			function render() {
				game.debug.cameraInfo(game.camera, 32, 32);
				game.debug.spriteCoords(player, 32, 500);
			}
		}	
	}]);
});