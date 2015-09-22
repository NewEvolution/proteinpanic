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
  .controller("gameCtrl", ["$q", "$firebaseArray", "uid", "proteinPanic", "preload",
  function($q, $firebaseArray, uid, proteinPanic, preload) {
    
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
            intro = data[key].intro;
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
                  proteinAminos.push("STOP");
                }
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
              theGame(); // All preparations are complete, get the party started!
            });
          });
        }
      });
    }

    var wKey;
    var aKey;
    var sKey;
    var dKey;
    var eyes;
    var tRNA;
    var title;
    var player;
    var hitbox;
    var cursors;
    var Adenine;
    var Guanine;
    var Thymine;
    var Cytosine;
    var ribosome;
    var page = 0;
    var ribounder;
    var countText;
    var introText;
    var aminoGroup;
    var codonGroup;
    var largeSpeech;
    var smallSpeech;
    var playerColor;
    var countHolder;
    var proteinGroup;
    var carriedAmino;
    var intro = true;
    var mouse = false;
    var noclip = false;
    var aminoCount = 0;
    var talkCycles = 0;
    var aminosRemaining;
    var nucleotideGroup;
    var codonChain = [];
    var blinkCounter = 0;
    var collectCodonGroup;
    var codonSliding = 45;
    var mousedOver = false;
    var proteinAminos = [];
    var aminoToCollectGroup;
    var spinningOut = false;
    var checkpointCount = 10;
    var mouthOpenCounter = 0;
    var extrudingProtein = 5;
    var intenseDebug = false;
    var carryingAmino = false;
    var controlsLocked = true;
    var chosenProtein = "Test";
    var mouthClosedCounter = 0;
    var introContent = [
      "Welcome to\n\n\nThe collection game where you can build all the proteins in the human body!\n\nMy name's Riley, and I'm a ribosome. I'll be your guide throughout the game, but first, let's learn how to play.",
      "Those little colorful beings bouncing around in the background are amino acids, the building blocks of protiens.\n\nAs a ribosome, my job is to assemble those amino acids in a specific order to build a protein, but there's more to it than that, and that's where you come in.",
      "You see, as a ribosome, I'm fixed in place in the wall of the rough endoplasmic reticulum that surrounds the nucleus of the cell.  I can't run off and grab the amino acids we need to build the protein.\n\nGrabbing the right amino is up to you, the transport RNA!",
      "The long colorful chain at the bottom of the screen is half of a strand of DNA, and it tells us what amino acids we need to build the protein.\n\nThe colored bars sticking up from the DNA backbone are called nucleotides, and come in one of four types:\n\nAdenine  Cytosine  Guanine  Thymine",
      "Yet some more text.  Woo."
    ];

    function theGame() {
      game.state.add("theGame", {preload: preload, create: create, update: update});
      game.state.start("theGame");

//-------------------------------------------------------------------------------------------------      

      function create() {
        // Generic setup ##########################################################################
        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 1200, 1200, "background");
        game.world.setBounds(0, 0, 1200, 1200);
        if(!mouse) {
          cursors = game.input.keyboard.createCursorKeys();
        }

        // Built protein block ####################################################################
        proteinGroup = game.add.group();
        proteinGroup.name = "proteinGroup";
        proteinGroup.fixedToCamera = true;

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
        aminoGroup.name = "aminoGroup";
        aminoGroup.enableBody = true;
        for (var i = 0; i < 15; i++) {
          var theAmino = "";
          if(i < 5) {
            theAmino = proteinAminos[i];
          } else {
            while(theAmino === "" || theAmino === "STOP") { // The stop shouldn't be on stage...
              theAmino = game.rnd.pick(proteinAminos);
            }
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
        aminosRemaining = proteinAminos.length - 1; // -1 for the stop codon
        countHolder = game.add.sprite(10, 10);
        countHolder.fixedToCamera = true;
        countText = game.add.text(0, 0, aminosRemaining + " Left!");
        countHolder.addChild(countText);


        // Ribosome & codon block #################################################################
        ribounder = game.add.sprite(20, 410, "ribo-under");
        codonGroup = game.add.group();
        codonGroup.name = "codonGroup";
        ribosome = game.add.sprite(20, 410, "ribosome");
        riboeyes = game.add.sprite(85, 432, "riboeyes");
        smallSpeech = game.add.sprite(170, 440, "speech_bubble");
        largeSpeech = game.add.sprite(170, 80, "large_bubble");

        smallSpeech.visible = false;
        largeSpeech.visible = false;
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
        smallSpeech.fixedToCamera = true;
        largeSpeech.fixedToCamera = true;
        for (var c = 0; c <codonChain.length; c++) {
          var nucleotide = codonGroup.create(134 + (15 * c), 520, codonChain[c]);
        }

        // Introductory instructions ##############################################################
        if(intro) {
          largeSpeech.visible = true;
          prevBtn = game.add.button(220, 435, "prev-btn", prevFunc, this, 0, 1, 2, 0);
          nextBtn = game.add.button(780, 435, "next-btn", nextFunc, this, 0, 1, 2, 0);
          introText = game.add.text(65, 25, introContent[0], {align: "center", wordWrap: true, wordWrapWidth: 575});
          nucleotideGroup = game.add.group();
          Adenine = nucleotideGroup.create(150, 330, "a");
          Cytosine = nucleotideGroup.create(275, 330, "c");
          Guanine = nucleotideGroup.create(395, 330, "g");
          Thymine = nucleotideGroup.create(520, 330, "t");
          nucleotideGroup.visible = false;
          tRNA = game.add.sprite(390, 315, "player");
          var t_eyes = game.add.sprite(0, 0, "eyes");
          tRNA.addChild(t_eyes);
          tRNA.tint = playerColor;
          tRNA.scale.x = -1;
          tRNA.visible = false;
          largeSpeech.addChild(introText);
          largeSpeech.addChild(tRNA);
          largeSpeech.addChild(nucleotideGroup);
          title = game.add.sprite(250, 150, "title");
          prevBtn.fixedToCamera = true;
          nextBtn.fixedToCamera = true;
          title.fixedToCamera = true;
          prevBtn.visible = false;
          talkCycles = game.rnd.integerInRange(3, 8);
        } else {
          startGame();
        }

      }

//-------------------------------------------------------------------------------------------------

      function nextFunc() {
        page++;
        if(page > 0) {
          prevBtn.visible = true;
          title.visible = false;
        }
        if(page === 2) {
          tRNA.visible = true;
        } else {
          tRNA.visible = false;
        }
        if(page === 3) {
          nucleotideGroup.visible = true;
        } else {
          nucleotideGroup.visible = false;
        }
        introText.text = introContent[page];
        talkCycles = game.rnd.integerInRange(3, 8);
      }

      function prevFunc() {
        if(page > 0) {
          page--;
        }
        if(page === 0) {
          prevBtn.visible = false;
          title.visible = true;
        }
        if(page === 2) {
          tRNA.visible = true;
        } else {
          tRNA.visible = false;
        }
        if(page === 3) {
          nucleotideGroup.visible = true;
        } else {
          nucleotideGroup.visible = false;
        }
        introText.text = introContent[page];
      }

      function startGame() {
        // Collection instructions block ##########################################################
        controlsLocked = false;
        codonSliding = 0;
        smallSpeech.visible = true;
        aminoToCollectGroup = game.add.group();
        aminoToCollectGroup.name = "aminoToCollectGroup";
        aminoToCollectGroup.fixedToCamera = true;
        var aminoToCollect = aminoToCollectGroup.create(510, 444, proteinAminos[0]);
        aminoToCollect.y += (60 - aminoToCollect.height) / 2;
        aminoToCollect.x += (60 - aminoToCollect.width) / 2;

        collectCodonGroup = game.add.group();
        collectCodonGroup.name = "collectCodonGroup";
        collectCodonGroup.fixedToCamera = true;
        var firstNucleotide = collectCodonGroup.create(220, 464, codonChain[0]);
        var secondtNucleotide = collectCodonGroup.create(235, 464, codonChain[1]);
        var thirdNucleotide = collectCodonGroup.create(250, 464, codonChain[2]);
      }

//-------------------------------------------------------------------------------------------------

      function update() {
        game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);
        game.physics.arcade.overlap(player, hitbox, inTheRibosome, null, this);
        if(!noclip) {game.physics.arcade.collide(player, aminoGroup, checkAmino, null, this);}
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

        // Ribosome talking #######################################################################
        if(talkCycles > 0 && ribosome.frame === 0) {
          if(mouthClosedCounter < game.rnd.integerInRange(3, 10)) {
            mouthClosedCounter++;
          } else {
            mouthClosedCounter = 0;
            ribosome.frame = 1;
          }
        }
        if(ribosome.frame === 1) {
          if(mouthOpenCounter < game.rnd.integerInRange(5, 20)) {
            mouthOpenCounter++;
          } else {
            talkCycles--;
            mouthOpenCounter = 0;
            ribosome.frame = 0;
          }
        }

        // Player Motion ##########################################################################
        if(ribosome.input.pointerOver() && !mousedOver) {
          mousedOver = true; // So we don't just hurtle off into the aether upon game start
        }
        player.frame = 0;
        eyes.frame = 0;
        if(spinningOut) {
          player.rotation += 0.5;
        } else if(!controlsLocked) {
          if(mouse && mousedOver) { // Mouse-follow controls
            game.physics.arcade.moveToPointer(player, 60, game.input.activePointer, 400);
          } else if(!mouse) { // Keyboard controls
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if(cursors.left.isDown || aKey.isDown) {
              player.body.velocity.x = -300;
              player.frame = 1;
              eyes.frame = 1;
            } else if(cursors.right.isDown || dKey.isDown) {
              player.body.velocity.x = 300;
              player.frame = 1;
              eyes.frame = 1;
            }
            if(cursors.up.isDown || wKey.isDown) {
              player.body.velocity.y = -300;
            } else if(cursors.down.isDown || sKey.isDown) {
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

        // Assembled protein on stage management ##################################################
        if(extrudingProtein < 5) { 
          proteinGroup.addAll("y", -1, true);
          proteinGroup.addAll("scale.x", -0.005, true);
          proteinGroup.addAll("scale.y", -0.005, true);
          var firstLivingAmino = proteinGroup.getFirstAlive();
          if(firstLivingAmino.scale.y < 0.08) {
            firstLivingAmino.kill();
          }
          extrudingProtein++;
        }

      }

//-------------------------------------------------------------------------------------------------

      function render() {
        game.debug.body(hitbox);
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
      }

//-------------------------------------------------------------------------------------------------

      // Called functions #######################################################################
      function inTheRibosome() {
        if(carriedAmino !== undefined && carryingAmino === true) {
          if(intenseDebug) {
            console.log("Entering Ribosome --------------------------------------------------------");
            aminoGroup.forEachAlive(function(liveAmino) {
              console.log("liveAmino = ", liveAmino.key);
            });
          }
          talkCycles = game.rnd.integerInRange(5, 10);
          carriedAmino.destroy();
          carryingAmino = false;
          extrudingProtein = 0;
          codonSliding = 0;
          if(proteinAminos.length === 1) {
            // won goes here
          }
          collectCodonGroup.forEachAlive(function(liveNucleotide) {
            liveNucleotide.kill();
          });
          aminoCount++;
          var codonSeqStart = aminoCount * 3;
          if(intenseDebug) {console.log("Building Codon -----------------------------------------------------------");}
          for(var rn = 0; rn < 3; rn++) {
            var promisedNucleotide = spriteRevival(collectCodonGroup, codonChain[(codonSeqStart + rn)], 220 + (15 * rn), 464);
          }
          if(intenseDebug) {console.log("Building Protein ---------------------------------------------------------");}
          var promisedAssembledAmino = spriteRevival(proteinGroup, proteinAminos[0], 60, 400);
          promisedAssembledAmino.then(function(assembledAmino) {
            assembledAmino.scale.x = 1;
            assembledAmino.scale.y = 1;
          });
          proteinAminos.splice(0, 1);
          countText.text = (proteinAminos.length - 1) + " Left!";
          var justCollectedAmino = aminoToCollectGroup.getFirstAlive();
          justCollectedAmino.kill();
          if(intenseDebug) {console.log("Building Collection Icon -------------------------------------------------");}
          var promisedAminoToCollect = spriteRevival(aminoToCollectGroup, proteinAminos[0], 510, 444);
          promisedAminoToCollect.then(function(aminoToCollect) {
            aminoToCollect.y += (60 - aminoToCollect.height) / 2;
            aminoToCollect.x += (60 - aminoToCollect.width) / 2;
          });
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
          if(intenseDebug) {console.log("Good Amino Contact -------------------------------------------------------");}
          carryingAmino = true;
          theAmino.kill();
          carriedAmino = game.add.sprite(0, -60, theAmino.key);
          carriedAmino.anchor.setTo(0.5, 0.5);
          player.addChild(carriedAmino);
          var aliveCount = 0;
          var neededAminoAvailable = false;
          aminoGroup.forEachAlive(function(liveAmino) {
            if(intenseDebug) {console.log("liveAmino = ", liveAmino.key);}
            aliveCount++;
            if(liveAmino.key === proteinAminos[1]) { // Check to see if the amino we need next is on stage & alive
              neededAminoAvailable = true;
              if(intenseDebug) {console.log("The needed amino, " + proteinAminos[1] + " is alive and onstage");}
            }
          });
          // Always keep 15 aminos on screen
          if(intenseDebug) {console.log("there are " + aliveCount + " aminos live on stage");}
          if((aliveCount < 15 || !neededAminoAvailable) && proteinAminos[1] !== "STOP") { // we've reached the stop codon, level/protein complete
            var theNewAmino = "";
            if(neededAminoAvailable) { // if the next needed amino is available...
              while(theNewAmino === "" || theNewAmino === "STOP") { // the STOP shouldn't be on stage...
                theNewAmino = game.rnd.pick(proteinAminos); // toss a random amino from the pile of needed aminos onto the stage...
                if(intenseDebug) {console.log("So we queued a " + theNewAmino + " up");}
              }
            } else {
              theNewAmino = proteinAminos[1]; // otherwise, toss the one we need on stage.
              if(intenseDebug) {console.log("The needed amino was not here so we queued it, " + theNewAmino + ", up");}
            }
            var anAminoX = game.world.randomX;
            var anAminoY = game.world.randomY;
            while((anAminoX > player.x - 500 && anAminoX < player.x + 500) && (anAminoY > player.y - 500 && anAminoY < player.y + 500)) {
              anAminoX = game.world.randomX;
              anAminoY = game.world.randomY;
            }
            var promisedGoodAmino = spriteRevival(aminoGroup, theNewAmino, anAminoX, anAminoY);
            promisedGoodAmino.then(function(anAmino) {
              if(intenseDebug) {console.log(anAmino.key + " placed on stage");}
              anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
              anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
              anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
              anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
              anAmino.body.collideWorldBounds = true;
              anAmino.anchor.setTo(0.5, 0.5);
            });
          }
        }
      }

      function badAmino (player, theAmino) {
        if(intenseDebug) {
          console.log("Bad Amino Contact ----------------------------------------------------------");
          aminoGroup.forEachAlive(function(liveAmino) {
              console.log("liveAmino = ", liveAmino.key);
          });
        }
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
          var promisedBadAmino = spriteRevival(aminoGroup, carriedAmino.key, player.body.x, player.body.y - 60);
          promisedBadAmino.then(function(anAmino) {
            if(intenseDebug) {console.log(anAmino.key + " placed on stage");}
            anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), -300);
            anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
            anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
            anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
            anAmino.body.collideWorldBounds = true;
            anAmino.anchor.setTo(0.5, 0.5);
          });
          carriedAmino.destroy();
        }
      }

      function spriteRevival(targetedGroup, neededSprite, spriteX, spriteY) {
        var deferred = $q.defer();
        var ableToRevive = false;
        targetedGroup.forEachDead(function(deadSprite) {
          if(deadSprite.key === neededSprite && deadSprite.alive === false && !ableToRevive) {
            deadSprite.reset(spriteX, spriteY); // revive an existing dead amino if we have one that matches
            ableToRevive = true;
            if(intenseDebug) {console.log("revived " + deadSprite.key + " at " + spriteX + "x" + spriteY + " in " + targetedGroup.name);}
            deferred.resolve(deadSprite);
          }
        });
        if(!ableToRevive) {
          var spawnedSprite = targetedGroup.create(spriteX, spriteY, neededSprite);
          if(intenseDebug) {console.log("spawned " + spawnedSprite.key + " at " + spriteX + "x" + spriteY + " in " + targetedGroup.name);}
          deferred.resolve(spawnedSprite);
        }
        return deferred.promise;
      }

      function nothing() {} // So things can collide without doing anything other than bouncing off

    }

  }]);
});