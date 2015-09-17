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

    var countHolder;
    var countText;
    var aminosRemaining;
    var player;
    var cursors;
    var success;
    var aminoGroup;
    var sidebar;
    var sidebarIcons;
    var sidebarArray = ["A", "R", "N", "D", "C", "Q", "H", "I", "L", "T"];
    var stateText;
    var spriteText;

    function theGame() {
      game.state.add("theGame", {preload: preload, create: create, update: update});
      game.state.start("theGame");

      function create() {
        aminosRemaining = sidebarArray.length;

        game.add.tileSprite(0, 0, 1200, 1200, "background");

        game.world.setBounds(0, 0, 1200, 1200);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        player.anchor.setTo(0.5, 0.5); //so it flips around its middle

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;

        aminoGroup = game.add.group();

        sidebarIcons = game.add.group();

        aminoGroup.enableBody = true;

        for (var i = 0; i < 20; i++) {
          var theAmino = "";
          if(i < 5) {
            theAmino = sidebarArray[i];
          } else {
            theAmino = game.rnd.pick(sidebarArray);
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
          anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          anAmino.body.collideWorldBounds = true;
          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
        }

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
        game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);

        game.physics.arcade.overlap(player, aminoGroup, checkAmino, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.frame = 0;

        if (cursors.left.isDown) {
          player.body.velocity.x = -300;
          player.frame = 1;
        } else if (cursors.right.isDown) {
          player.body.velocity.x = 300;
          player.frame = 1;
        }

        if (cursors.up.isDown) {
          player.body.velocity.y = -300;
          player.frame = 2;
        } else if (cursors.down.isDown) {
          player.body.velocity.y = 300;
          player.frame = 3;
        }

        if(player.body.velocity.x > 0) {
          player.scale.x = 1;
        } else if(player.body.velocity.x < 0) {
          player.scale.x = -1;
        }

        function checkAmino (player, anAmino) {
          if (sidebarArray[0] === anAmino.key) { // left-to-right sidebar
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
          if(sidebarArray.length === 1) {
            stateText = game.add.text(300, 400, " YOU WON! \n Click to restart");
            spriteText.addChild(stateText);
            spriteText.visible = true;
            game.input.onTap.addOnce(create,this);
          }
          sidebarArray.splice(0, 1); // left-to-right sidebar
          anAmino.kill();
          countText.text = sidebarArray.length + " Left!";
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
            aminoGroup.children[l].body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
          }
          if(aminoGroup.children[l].body.velocity.x > 0) {
            aminoGroup.children[l].frame = 1;
          } else if(aminoGroup.children[l].body.velocity.x < 0) { 
            aminoGroup.children[l].frame = 0;
          }
        }

        // Always keep 20 aminoGroup on screen
        if (aliveCount < 20) {
          var theAmino = sidebarArray[0];

          //  Create a anAmino inside of the "aminoGroup" group
          var anAminoX = 201;
          var anAminoY = 301;
          while((anAminoX > player.x - 100 && anAminoX < player.x + 100) && (anAminoY > player.y - 100 && anAminoY < player.y + 100)) {
            anAminoX = game.rnd.integerInRange(0, 1200);
            anAminoY = game.rnd.integerInRange(0, 1200);
          }
          var anAmino = aminoGroup.create(anAminoX, anAminoY, theAmino);
          anAmino.anchor.setTo(0.5, 0.5); //so it flips around its middle
          anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);

          anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));

          anAmino.body.collideWorldBounds = true;

          anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
          anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
        }

        function render() {
          game.debug.cameraInfo(game.camera, 32, 32);
          game.debug.spriteCoords(player, 32, 500);
        }
      } 

    }

  }]);
});