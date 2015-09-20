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
    
    var proteinsArr = $firebaseArray(proteins);
    var aminosArr = $firebaseArray(aminos);
    var usersArr = $firebaseArray(users);
    var currentUID = null;
    var username = "";

    var authData = ref.getAuth();
    if(authData === null) {
      window.location = "/";
    } else {
      uid.setUid(authData.uid);
      currentUID = authData.uid;
      usersArr.$loaded().then(function(data) {
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
          aminosArr.$loaded().then(function(aminosData) {
            proteinsArr.$loaded().then(function(proteinsData) {
              for(var p = 0; p < proteinsArr.length; p++) {
                if(proteinsArr[p].name === chosenProtein) {
                  proteinAminos = proteinsArr[p].sequence.split(""); // Grab the list of amino acids & build the array to grab
                }
                for(var pa = 0; pa < proteinAminos.length; pa++) {
                  for (var a = 0; a < aminosArr.length; a++) {
                    if(aminosArr[a].code === proteinAminos[pa]) { // If the amino matches the amino in our grabbing array...
                      var theCodon = game.rnd.pick(aminosArr[a].codons); // grab one of its possible codons...
                      for (var c = 0; c < theCodon.length; c++) {
                        codonChain.push(theCodon[c].toLowerCase()); // and add each nucleotide in sequence to our DNA strand!
                      }
                    }
                  }
                }
              }
              theGame(); // All preparations are complete, get the party started!
            });
          });
        }
      });
    }

    var eyes;
    var player;
    var hitbox;
    var speech;
    var cursors;
    var ribosome;
    var ribounder;
    var countText;
    var stateText;
    var spriteText;
    var aminoGroup;
    var codonGroup;
    var playerColor;
    var countHolder;
    var carriedAmino;
    var mouse = false;
    var codonChain = [];
    var aminosRemaining;
    var codonSliding = 0;
    var blinkCounter = 0;
    var proteinAminos = [];
    var mousedOver = false;
    var aminoToCollectGroup;
    var spinningOut = false;
    var carryingAmino = false;
    var chosenProtein = "Insulin";

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

        // Aminos to collect count ################################################################
        aminosRemaining = proteinAminos.length;
        countHolder = game.add.sprite(0, 0);
        countHolder.fixedToCamera = true;
        countText = game.add.text(0, 0, aminosRemaining + " Left!");
        countHolder.addChild(countText);
        countHolder.cameraOffset.x = 140;
        countHolder.cameraOffset.y = 10;


        // Ribosome & codon block #################################################################
        ribounder = game.add.sprite(20, 410, "ribo-under");
        codonGroup = game.add.group();
        ribosome = game.add.sprite(20, 410, "ribosome");
        riboeyes = game.add.sprite(85, 432, "riboeyes");
        speech = game.add.sprite(170, 440, "speech_bubble");
        hitbox = game.add.sprite(20, 500, "hitbox");
        game.physics.arcade.enable(ribosome);
        game.physics.arcade.enable(hitbox);
        ribosome.body.immovable = true;
        hitbox.body.immovable = true;
        ribosome.inputEnabled = true;
        codonGroup.fixedToCamera = true;
        ribounder.fixedToCamera = true;
        ribosome.fixedToCamera = true;
        riboeyes.fixedToCamera = true;
        hitbox.fixedToCamera = true;
        speech.fixedToCamera = true;
        for (var c = 0; c <codonChain.length; c++) {
          var nucleotide = codonGroup.create(135 + (15 * c), 520, codonChain[c]);
        }

        // Collection instructions block ##########################################################
        aminoToCollectGroup = game.add.group();
        aminoToCollectGroup.fixedToCamera = true;
        var aminoToCollect = aminoToCollectGroup.create(300, 444, proteinAminos[0]);
        aminoToCollect.y += (60 - aminoToCollect.height) / 2;
        aminoToCollect.x += (60 - aminoToCollect.width) / 2;

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

        // Codons on stage management #############################################################
        if(codonSliding < 45) {
          codonGroup.addAll("x", -1, true);
          var firstLivingCodon = codonGroup.getFirstAlive();
          if(firstLivingCodon.x < -15) {
            firstLivingCodon.kill();
          }
          codonSliding++;
        }

        // Called functions #######################################################################
        function inTheRibosome() {
          if(carriedAmino !== undefined && carryingAmino === true) {
            carryingAmino = false;
            codonSliding = 0;
            if(proteinAminos.length === 1) {
              // won goes here
            }
            proteinAminos.splice(0, 1);
            carriedAmino.destroy();
            countText.text = proteinAminos.length + " Left!";
            var justCollectedAmino = aminoToCollectGroup.getFirstAlive();
            justCollectedAmino.kill();
            var ableToRevive = false;
            aminoToCollectGroup.forEachDead(function(deadAmino) {
              if(deadAmino.key === proteinAminos[0] && !ableToRevive) {
                deadAmino.reset(300, 444); // revive an existing dead amino if we have one that matches...
                deadAmino.y += (60 - deadAmino.height) / 2;
                deadAmino.x += (60 - deadAmino.width) / 2;
                ableToRevive = true;
              }
            });
            if(!ableToRevive) { // otherwise spawn a new one
              var aminoToCollect = aminoToCollectGroup.create(300, 444, proteinAminos[0]);
              aminoToCollect.y += (60 - aminoToCollect.height) / 2;
              aminoToCollect.x += (60 - aminoToCollect.width) / 2;
            }
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
            var aliveCount = 0;
            var neededAminoAvailable = false;
            aminoGroup.forEachAlive(function(liveAmino) {
              aliveCount++;
              if(liveAmino.key === proteinAminos[1]) { // Check to see if the amino we need next is on stage & alive
                neededAminoAvailable = true;
              }
            });
            // Always keep 15 aminos on screen
            if((aliveCount < 15 || !neededAminoAvailable) && proteinAminos[1] !== undefined) { // if the array is empty i.e. the level is complete
              theAmino = "";
              if(neededAminoAvailable) { // if the next needed amino is available...
                theAmino = game.rnd.pick(proteinAminos); // toss a random amino from the pile of needed aminos onto the stage...
              } else {
                theAmino = proteinAminos[1]; // otherwise, toss the one we need on stage.
              }
              var anAminoX = game.rnd.integerInRange(0, 1200);
              var anAminoY = game.rnd.integerInRange(0, 1200);
              while((anAminoX > player.x - 500 && anAminoX < player.x + 500) && (anAminoY > player.y - 500 && anAminoY < player.y + 500)) {
                anAminoX = game.rnd.integerInRange(0, 1200);
                anAminoY = game.rnd.integerInRange(0, 1200);
              }
              var ableToRevive = false;
              aminoGroup.forEachDead(function(deadAmino) {
                if(deadAmino.key === theAmino && !ableToRevive) {
                  deadAmino.reset(anAminoX, anAminoY); // revive an existing dead amino if we have one that matches
                  ableToRevive = true;
                }
              });
              if(!ableToRevive) {
                var anAmino = aminoGroup.create(anAminoX, anAminoY, theAmino);
                anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
                anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
                anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
                anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
                anAmino.body.collideWorldBounds = true;
                anAmino.anchor.setTo(0.5, 0.5);
              }
            }
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
            var ableToRevive = false;
            aminoGroup.forEachDead(function(deadAmino) {
              if(deadAmino.key === carriedAmino.key && !ableToRevive) {
                deadAmino.reset(player.body.x, player.body.y - 60); // revive an existing dead amino if we have one that matches
                deadAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), -300);
                ableToRevive = true;
              }
            });
            if(!ableToRevive) {
              var anAmino = aminoGroup.create(player.body.x, player.body.y - 60, carriedAmino.key);
              anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), -300);
              anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
              anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
              anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
              anAmino.body.collideWorldBounds = true;
              anAmino.anchor.setTo(0.5, 0.5);
            }
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