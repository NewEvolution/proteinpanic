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
          theGame();
        }
      }));
    }

    var player;
    var cursors;
    var ribosome;
    var countText;
    var stateText;
    var spriteText;
    var aminoGroup;
    var countHolder;
    var carriedAmino;
    var aminoToCollect;
    var aminosRemaining;
    var blinkCounter = 0;
    var homeSafe = false;
    var aminoToCollectGroup;
    var proteinAminos = ["A", "R", "N", "D", "C", "Q", "H", "I", "L", "T"];

    function theGame() {
      game.state.add("theGame", {preload: preload, create: create, update: update, render: render});
      game.state.start("theGame");

      function create() {
        aminosRemaining = proteinAminos.length;

        game.add.tileSprite(0, 0, 1200, 1200, "background");

        game.world.setBounds(0, 0, 1200, 1200);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        player.anchor.setTo(0.5, 0.5); //so it flips around its middle

        game.physics.arcade.enable(player);
        player.body.allowRotation = false;

        player.body.collideWorldBounds = true;

        aminoGroup = game.add.group();

        aminoGroup.enableBody = true;

        aminoToCollectGroup = game.add.group();

        for (var i = 0; i < 10; i++) {
          var theAmino = "";
          if(i < 5) {
            theAmino = proteinAminos[i];
          } else {
            theAmino = game.rnd.pick(proteinAminos);
          }
          var aminoX = 201;
          var aminoY = 301;
          while((aminoX > 200 && aminoX < 1000) && (aminoY > 300 && aminoY < 900)) {
            aminoX = game.rnd.integerInRange(0, 1200);
            aminoY = game.rnd.integerInRange(0, 1200);
          }
          var anAmino = aminoGroup.create(aminoX, aminoY, theAmino);
          anAmino.anchor.setTo(0.5, 0.5); //so it flips around its middle
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
          anAmino.body.velocity.set(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
          anAmino.body.collideWorldBounds = true;
          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
        }

        game.camera.follow(player);

        countHolder = game.add.sprite(0,0);
        countHolder.fixedToCamera = true;
        countText = game.add.text(0,0,aminosRemaining + " Left!");
        countHolder.addChild(countText);
        countHolder.cameraOffset.x = 140;
        countHolder.cameraOffset.y = 10;

        for (var k = 0; k < proteinAminos.length; k++) {
          var aminoToCollect = aminoToCollectGroup.create(10 + (70 * k), 10, proteinAminos[k]);
          aminoToCollect.fixedToCamera = true;
          if(k > 1) {
              aminoToCollectGroup.children[k].alpha = 0;
          }
          if(k === 1) {
            aminoToCollectGroup.children[k].scale.x = 0.7;
            aminoToCollectGroup.children[k].scale.y = 0.7;
          }
        }

        ribosome = game.add.sprite(0,0, "ribosome");
        game.physics.arcade.enable(ribosome);
        ribosome.fixedToCamera = true;
        ribosome.cameraOffset.x = 20;
        ribosome.cameraOffset.y = 410;
        
        eyes = game.add.sprite(0,0, "eyes");
        eyes.fixedToCamera = true;
        eyes.cameraOffset.x = 85;
        eyes.cameraOffset.y = 432;

        spriteText = game.add.sprite(0, 0);
        spriteText.fixedToCamera = true;
        spriteText.visible = false;
      }

      function update() {
        game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);
        game.physics.arcade.overlap(player, ribosome, homeBase, null, this);
        // game.physics.arcade.overlap(player, aminoGroup, checkAmino, null, this);

        var blink = game.rnd.integerInRange(0, 300);
        if(blink === 10 && eyes.frame === 0) {
          eyes.frame = 1;
        }

        if(eyes.frame === 1) {
          if(blinkCounter < 5) {
            blinkCounter++;
          } else {
            blinkCounter = 0;
            eyes.frame = 0;
          }
        }

        player.frame = 0;

        // game.physics.arcade.moveToPointer(player, 300);

        player.rotation = game.physics.arcade.moveToPointer(player, 50, game.input.activePointer, 500);

        // if(((Math.abs((player.body.x + player.body.width/2) - game.input.x)) < 5) && ((Math.abs((player.body.y + player.body.height/2) - game.input.y)) < 5))
        // {
        //     player.body.velocity.setTo(0, 0);
        // }

        if(Math.abs(player.body.velocity.x) > 50) {
          player.frame = 1;
        }

        // if(player.body.velocity.y < -150) {
        //   player.frame = 2;
        // } else if(player.body.velocity.y > 150) {
        //   player.frame = 3;
        // }

        // if(player.body.velocity.x > 0) {
        //   player.scale.y = 1;
        // } else if(player.body.velocity.x < 0) {
        //   player.scale.y = -1;
        // }

        function homeBase() {
          if(!homeSafe) {
            homeSafe = true;
            console.log("Ding!");
          }
        }

        function checkAmino (player, anAmino) {
          if(proteinAminos[0] === anAmino.key) { // left-to-right aminoToCollect
            goodAmino(player, anAmino);
          } else {
            badAmino(player, anAmino);
          }
        }

        function rotateBoth(item1, item2) {
          item1.rotation = game.rnd.realInRange(-0.2, 0.2);
          item2.rotation = game.rnd.realInRange(-0.2, 0.2);
        }

        function goodAmino (player, anAmino) {
          if(proteinAminos.length === 1) {
            stateText = game.add.text(300, 400, " YOU WON! \n Click to restart");
            spriteText.addChild(stateText);
            spriteText.visible = true;
            game.input.onTap.addOnce(create,this);
          }
          proteinAminos.splice(0, 1); // left-to-right aminoToCollect
          anAmino.kill();
          countText.text = proteinAminos.length + " Left!";
          aminoToCollectGroup.removeAll(); // left-to-right aminoToCollect
          for (var m = 0; m < proteinAminos.length; m++) {
            var aminoToCollect = aminoToCollectGroup.create(10 + (70 * m), 10, proteinAminos[m]);
            aminoToCollect.fixedToCamera = true;
            if(m > 1) {
              aminoToCollectGroup.children[m].alpha = 0;
            }
            if(m === 1) {
              aminoToCollectGroup.children[m].scale.x = 0.7;
              aminoToCollectGroup.children[m].scale.y = 0.7;
            }
          }
        }

        function badAmino (player, anAmino) {
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
          game.input.onTap.addOnce(create, this);
        }

        var aliveCount = 0;
        for (var l = 0; l < aminoGroup.children.length; l++) {
          if(aminoGroup.children[l].alive === true) {
            aliveCount++;
          }
          if(Math.abs(aminoGroup.children[l].body.velocity.x) < 40 || Math.abs(aminoGroup.children[l].body.velocity.y) < 40) {
            aminoGroup.children[l].body.velocity.set(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
          }
          if(aminoGroup.children[l].body.velocity.x > 0) {
            aminoGroup.children[l].frame = 1;
          } else if(aminoGroup.children[l].body.velocity.x < 0) { 
            aminoGroup.children[l].frame = 0;
          }
        }

        // Always keep 10 aminos on screen
        if(aliveCount < 10) {
          var theAmino = proteinAminos[0];
          var anAminoX = 201;
          var anAminoY = 301;
          while((anAminoX > player.x - 400 && anAminoX < player.x + 400) && (anAminoY > player.y - 400 && anAminoY < player.y + 400)) {
            anAminoX = game.rnd.integerInRange(0, 1200);
            anAminoY = game.rnd.integerInRange(0, 1200);
          }
          var anAmino = aminoGroup.create(anAminoX, anAminoY, theAmino);
          anAmino.anchor.setTo(0.5, 0.5); //so it flips around its middle
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);

          anAmino.body.velocity.set(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));

          anAmino.body.collideWorldBounds = true;

          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
        }

      } 

      function render() {
        game.debug.body(player);
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
      }

    }

  }]);
});