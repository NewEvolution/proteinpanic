define([
  "angular",
  "firebase",
  "bootstrap",
  "angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
  angular.module("AminoApp.game", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/game", {
      templateUrl: "../partials/game.html",
      controller: "gameCtrl",
      controllerAs: "game"
    });
  }])
  .controller("gameCtrl", ["$firebaseArray", "uid", "proteinPanic", "preload",
  function($firebaseArray, uid, proteinPanic, preload) {
    
    var game = proteinPanic;

    var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
    var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var username = "";

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
            playerColor = "0x" + data[key].color.slice(1);
            username = data[key].username;
            userDoesNotExist = false;
            mouse = data[key].mouse;
          }
        }
        if(userDoesNotExist) {
          usersArr.$add({uid: currentUID});
        }
        if(username === "") {
          window.location = "#/user";
        } else {
          theGame();
        }
      }));
    }

    var eyes;
    var player;
    var hitbox;
    var cursors;
    var ribosome;
    var countText;
    var stateText;
    var spriteText;
    var aminoGroup;
    var playerColor;
    var countHolder;
    var carriedAmino;
    var mouse = false;
    var aminosRemaining;
    var blinkCounter = 0;
    var mousedOver = false;
    var aminoToCollectGroup;
    var spinningOut = false;
    var carryingAmino = false;
    var proteinAminos = ["A", "R", "N", "D", "C", "Q", "H", "I", "L", "T"];

    function theGame() {
      game.state.add("theGame", {preload: preload, create: create, update: update});
      game.state.start("theGame");

//-------------------------------------------------------------------------------------------------      

      function create() {
        // Generic setup ##########################################################################
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 1200, 1200, "background");
        game.world.setBounds(0, 0, 1200, 1200);
        if(!mouse) {
          cursors = game.input.keyboard.createCursorKeys();
        }

        // Player block ###########################################################################
        player = game.add.sprite(100, 1100, "player");
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        eyes = game.add.sprite(0, 0, "eyes");
        player.anchor.setTo(0.5, 0.5);
        eyes.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.tint = playerColor;
        player.addChild(eyes);

        // Amino swarm block ######################################################################
        aminoGroup = game.add.group();
        aminoGroup.enableBody = true;
        for (var i = 0; i < 15; i++) {
          var theAmino = "";
          if(i < 5) {
            theAmino = proteinAminos[i];
          } else {
            theAmino = game.rnd.pick(proteinAminos);
          }
          var aminoX = 0;
          var aminoY = 1200;
          while(aminoX < 200 && aminoY > 1000) { // Don't spawn inside the ribosome
            aminoX = game.rnd.integerInRange(0, 1200);
            aminoY = game.rnd.integerInRange(0, 1200);
          }
          var anAmino = aminoGroup.create(aminoX, aminoY, theAmino);
          anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
          anAmino.body.collideWorldBounds = true;
          anAmino.anchor.setTo(0.5, 0.5);
        }

        // Collection instructions block ##########################################################
        aminoToCollectGroup = game.add.group();
        var aminoToCollect = aminoToCollectGroup.create(0, 0, proteinAminos[0]);
        aminoToCollect.fixedToCamera = true;

        // Aminos to collect count ################################################################
        aminosRemaining = proteinAminos.length;
        countHolder = game.add.sprite(0, 0);
        countHolder.fixedToCamera = true;
        countText = game.add.text(0, 0, aminosRemaining + " Left!");
        countHolder.addChild(countText);
        countHolder.cameraOffset.x = 140;
        countHolder.cameraOffset.y = 10;


        // Ribosome block #########################################################################
        ribosome = game.add.sprite(0, 0, "ribosome");
        riboeyes = game.add.sprite(0, 0, "riboeyes");
        hitbox = game.add.sprite(0, 0, "hitbox");
        game.physics.arcade.enable(ribosome);
        game.physics.arcade.enable(hitbox);
        ribosome.body.immovable = true;
        hitbox.body.immovable = true;
        ribosome.inputEnabled = true;
        ribosome.fixedToCamera = true;
        ribosome.cameraOffset.x = 20;
        ribosome.cameraOffset.y = 410;
        riboeyes.fixedToCamera = true;
        riboeyes.cameraOffset.x = 85;
        riboeyes.cameraOffset.y = 432;
        hitbox.fixedToCamera = true;
        hitbox.cameraOffset.x = 20;
        hitbox.cameraOffset.y = 500;

        // Gameover / win text ####################################################################
        spriteText = game.add.sprite(0, 0);
        spriteText.fixedToCamera = true;
        spriteText.visible = false;
      }

//-------------------------------------------------------------------------------------------------

      function update() {
        game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);
        game.physics.arcade.overlap(player, hitbox, inTheRibosome, null, this);
        game.physics.arcade.collide(player, aminoGroup, checkAmino, null, this);
        game.physics.arcade.collide(ribosome, aminoGroup, nothing, null, this);


        // Ribosome blinking ######################################################################
        var blink = game.rnd.integerInRange(0, 300);
        if(blink === 10 && riboeyes.frame === 0) {
          riboeyes.frame = 1;
        }
        if(riboeyes.frame === 1) {
          if(blinkCounter < 5) {
            blinkCounter++;
          } else {
            blinkCounter = 0;
            riboeyes.frame = 0;
          }
        }

        // Player Motion ##########################################################################
        if (ribosome.input.pointerOver() && !mousedOver) {
          mousedOver = true; // So we don't just hurtle off into the aether upon game start
        }
        player.frame = 0;
        eyes.frame = 0;
        if(spinningOut) {
          player.rotation += 0.5;
        } else {
          if(mouse && mousedOver) { // Mouse-follow controls
            game.physics.arcade.moveToPointer(player, 60, game.input.activePointer, 400);
          } else if(!mouse) { // Keyboard controls
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (cursors.left.isDown) {
              player.body.velocity.x = -300;
              player.frame = 1;
              eyes.frame = 1;
            } else if (cursors.right.isDown) {
              player.body.velocity.x = 300;
              player.frame = 1;
              eyes.frame = 1;
            }
            if (cursors.up.isDown) {
              player.body.velocity.y = -300;
            } else if (cursors.down.isDown) {
              player.body.velocity.y = 300;
            }
          }

          if(Math.abs(player.body.velocity.x) > 150) {
            player.frame = 1;
            eyes.frame = 1;
          }

          if(player.body.velocity.y < -150) {
            player.frame = 2;
            eyes.frame = 2;
          } else if(player.body.velocity.y > 150) {
            player.frame = 3;
            eyes.frame = 3;
          }

          if(player.body.velocity.x > 0) {
            player.scale.x = -1;
            if(player.children[1]) {
              player.children[1].frame = 1;
              player.children[1].scale.x = -1;
            }
          } else if(player.body.velocity.x < 0) {
            player.scale.x = 1;
            if(player.children[1]) {
              player.children[1].frame = 0;
              player.children[1].scale.x = 1;
            }
          }
        }

        // Aminos on stage management #############################################################
        var aliveCount = 0;
        for (var l = 0; l < aminoGroup.children.length; l++) {
          if(aminoGroup.children[l].alive === true) {
            aliveCount++;
          }
          // If an amino is going to slow, speed it up
          if(Math.abs(aminoGroup.children[l].body.velocity.x) < 40 || Math.abs(aminoGroup.children[l].body.velocity.y) < 40) {
            aminoGroup.children[l].body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          }
          // Make sure the amino is facing the diretion it's traveling
          if(aminoGroup.children[l].body.velocity.x > 0) {
            aminoGroup.children[l].frame = 1;
          } else if(aminoGroup.children[l].body.velocity.x < 0) { 
            aminoGroup.children[l].frame = 0;
          }
        }
        // Always keep 15 aminos on screen
        if(aliveCount < 15 && proteinAminos[1] !== undefined) { // if the array is empty i.e. the level is complete
          var theAmino = proteinAminos[1];
          var anAminoX = 201;
          var anAminoY = 301;
          while((anAminoX > player.x - 400 && anAminoX < player.x + 400) && (anAminoY > player.y - 400 && anAminoY < player.y + 400)) {
            anAminoX = game.rnd.integerInRange(0, 1200);
            anAminoY = game.rnd.integerInRange(0, 1200);
          }
          var anAmino = aminoGroup.create(anAminoX, anAminoY, theAmino);
          anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
          anAmino.body.collideWorldBounds = true;
          anAmino.anchor.setTo(0.5, 0.5);
        }

        // Called functions #######################################################################
        function inTheRibosome() {
          if(carriedAmino !== undefined && carryingAmino === true) {
            carryingAmino = false;
            if(proteinAminos.length === 1) {
              // won goes here
            }
            proteinAminos.splice(0, 1);
            carriedAmino.destroy();
            countText.text = proteinAminos.length + " Left!";
            aminoToCollectGroup.removeAll();
            var aminoToCollect = aminoToCollectGroup.create(0, 0, proteinAminos[0]);
            aminoToCollect.fixedToCamera = true;
          }
        }

        function checkAmino (player, theAmino) {
          if(proteinAminos[0] === theAmino.key && carryingAmino === false) {
            goodAmino(player, theAmino);
          } else {
            badAmino(player, theAmino);
          }
        }

        function rotateBoth(item1, item2) {
          item1.rotation = game.rnd.realInRange(-0.2, 0.2);
          item2.rotation = game.rnd.realInRange(-0.2, 0.2);
        }

        function goodAmino (player, theAmino) {
          if(!spinningOut && !carryingAmino) {
            carryingAmino = true;
            theAmino.kill();
            carriedAmino = game.add.sprite(0, -60, theAmino.key);
            carriedAmino.anchor.setTo(0.5, 0.5);
            player.addChild(carriedAmino);
          }
        }

        function badAmino (player, theAmino) {
          spinningOut = true;
          theAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
          player.body.velocity.x = 0;
          player.body.velocity.y = 0;
          setTimeout(function() {
            spinningOut = false;
            player.rotation = 0;
          }, (1000));
          if(carryingAmino) {
            carryingAmino = false;
            var anAmino = aminoGroup.create(player.body.x, player.body.y - 60, carriedAmino.key);
            anAmino.body.velocity.set(game.rnd.integerInRange(-300, 300), -300);
            anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
            anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
            anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
            anAmino.body.collideWorldBounds = true;
            anAmino.anchor.setTo(0.5, 0.5);
            carriedAmino.destroy();
          }
        }

        function nothing() {} // So things can collide without doing anything other than bouncing off

      } 

//-------------------------------------------------------------------------------------------------

      function render() {
        game.debug.body(hitbox);
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
      }

    }

  }]);
});