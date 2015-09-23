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
  .controller("gameCtrl", ["$q", "$firebaseArray", "$firebaseObject", "uid", "proteinPanic", "preload",
  function($q, $firebaseArray, $firebaseObject, uid, proteinPanic, preload) {
    
    var game = proteinPanic;

    var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
    var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");
    
    var proteinsArr = $firebaseArray(proteins);
    var aminosArr = $firebaseArray(aminos);
    var usersObj = $firebaseObject(users);
    var usersArr = $firebaseArray(users);
    var initialLoad = true;
    var currentUID = null;
    var currentKey = null;
    var username = "";

    var mouse = false;
    var intenseDebug = false;

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
            currentKey = data[key].$id;
            userDoesNotExist = false;
            mouse = data[key].mouse;
            intro = data[key].intro;
            if (intro || !data[key].proteinInProgress) {
              chosenProtein = "Insulin";
              if(intenseDebug) {console.log("Didn't find a protein in progress");}
            } else {
              chosenProtein = data[key].proteinInProgress;
              if(intenseDebug) {console.log("Found a protein in progress: " + data[key].proteinInProgress);}
            }
          }
        }
        if(userDoesNotExist) {
          usersArr.$add({uid: currentUID});
        }
        if(username === "") {
          window.location = "#/user";
        } else {
          gameGeneration();
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
    var prevBtn;
    var nextBtn;
    var cursors;
    var Adenine;
    var Guanine;
    var Thymine;
    var Alanine;
    var Cytosine;
    var ribosome;
    var startBtn;
    var page = 0;
    var ribounder;
    var countText;
    var optionsBtn;
    var aminoGroup;
    var codonGroup;
    var largeSpeech;
    var smallSpeech;
    var playerColor;
    var countHolder;
    var continueBtn;
    var proteinGroup;
    var carriedAmino;
    var intro = true;
    var chosenProtein;
    var noclip = false;
    var aminoCount = 0;
    var talkCycles = 0;
    var aminosRemaining;
    var nucleotideGroup;
    var codonChain = [];
    var interstitialText;
    var blinkCounter = 0;
    var collectCodonGroup;
    var codonSliding = 45;
    var proteinDisplayName;
    var mousedOver = false;
    var proteinAminos = [];
    var aminoToCollectGroup;
    var spinningOut = false;
    var checkpointCount = 10;
    var mouthOpenCounter = 0;
    var extrudingProtein = 5;
    var carryingAmino = false;
    var controlsLocked = true;
    var mouthClosedCounter = 0;
    var introContent = [
      "",
      "Those little colorful beings bouncing around in the background are amino acids, the building blocks of proteins.\n\nAs a ribosome, my job is to assemble those amino acids in a specific order to build a protein, but there's more to it than that, and that's where you come in.",
      "You see, as a ribosome, I'm fixed in place in the wall of the rough endoplasmic reticulum that surrounds the nucleus of the cell.  I can't run off and grab the amino acids we need to build the protein.\n\nGrabbing the right amino acid is up to you, the transport RNA!",
      "The long colorful chain at the bottom of the screen is half of a strand of DNA, and it gives us our instructions for building the protein.\n\nHow does it do that? Well, the colored bars sticking up from the DNA's green backbone are called nucleotides, and they come in one of four types:\n\nAdenine  Cytosine  Guanine  Thymine",
      "Every amino acid can be represented by three nucleotides in a specific order. This group of three nucleotides is called a codon, and every amino acid has at least one codon, though some have more.\n\nFor example:\n\nis a codon for Alanine",
      "I'll read the DNA one codon at a time and tell you which amino acid to go catch. Once you've caught the amino acid, bring it back to me and I'll add it to the protein we're building.\n\nBe careful not to run into any of the other amino acids floating about, as they'll make you spin out and drop any amino acid you're carrying!",
      "Proteins can be very long, some contain thousands of amino acids! We'll start with a shorter one, but there will also be checkpoints along the way.\n\nOnce you've reached a checkpoint, you can restart from there later. You can change how often checkpoints happen in your user options.",
      "You control your flight around the inside of the cell with either the W A S D keys or arrow keys, or with your mouse/touch.\n\nYou can switch your control type on your user option screen as well.\n\nAt any point during the game you can press the \"P\" key to pause and check your progress.",
      "After completing a protein, or starting a new game you can choose your next protein to make.\n\nYou can only have one protein in progress at a time though, so starting a new protein will erase any progess you've made on an incomplete protein.",
      "That's the end of the introduction, you're now ready to start building your first protein!\n\nIf you'd like to see this intro again, you can check off \"Play Introduction\" in your user options.\n\nClick \"Start\" to start the game, or you can click \"Options\" to edit your user options."
    ];

    function gameGeneration() {
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
          if(initialLoad) {
            initialLoad = false;
            theGame(); // All preparations are complete, get the party started!
          } else {
            // kill EVERYTHING.
          }
        });
      });
    }

    function theGame() {
      introContent[0] = "Welcome to\n\n\nThe collection game where you can build all the proteins in the human body!\n\nHi " + username + "! My name's Riley, and I'm a ribosome. I'll be your guide throughout the game, but first, let's learn how to play.";
      game.state.add("theGame", {preload: preload, create: create, update: update});
      game.state.start("theGame");
    }

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
      interstitialText = game.add.text(0, 0, introContent[0], {align: "center", wordWrap: true, wordWrapWidth: 575});
      interstitialText.setTextBounds(65, 25, 575, 400);
      proteinDisplayName = game.add.text(0, 0, chosenProtein, {font: "bold 26pt Arial", fill: "navy", align: "center", boundsAlignH: "center", wordWrap: true, wordWrapWidth: 575});
      proteinDisplayName.setTextBounds(65, 130, 575, 300);
      title = game.add.sprite(80, 20, "title");
      optionsBtn = game.add.button(365, 365, "options-btn", optionsFunc, this, 0, 1, 2, 0);
      continueBtn = game.add.button(135, 365, "continue-btn", postIntroFunc, this, 0, 1, 2, 0);
      largeSpeech.addChild(title);
      largeSpeech.addChild(optionsBtn);
      largeSpeech.addChild(continueBtn);
      largeSpeech.addChild(interstitialText);
      largeSpeech.addChild(proteinDisplayName);

      smallSpeech.visible = false;
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
        prevBtn = game.add.button(50, 355, "prev-btn", prevFunc, this, 0, 1, 2, 0);
        nextBtn = game.add.button(610, 355, "next-btn", nextFunc, this, 0, 1, 2, 0);
        nucleotideGroup = game.add.group();
        Adenine = nucleotideGroup.create(150, 330, "a");
        Cytosine = nucleotideGroup.create(275, 330, "c");
        Guanine = nucleotideGroup.create(395, 330, "g");
        Thymine = nucleotideGroup.create(520, 330, "t");
        Alanine = nucleotideGroup.create(495, 305, "A");
        nucleotideGroup.visible = false;
        Alanine.visible = false;
        tRNA = game.add.sprite(390, 315, "player");
        var t_eyes = game.add.sprite(0, 0, "eyes");
        tRNA.addChild(t_eyes);
        tRNA.tint = playerColor;
        tRNA.scale.x = -1;
        tRNA.visible = false;
        startBtn = game.add.button(135, 365, "start-btn", postIntroFunc, this, 0, 1, 2, 0);
        largeSpeech.addChild(prevBtn);
        largeSpeech.addChild(nextBtn);
        largeSpeech.addChild(startBtn);
        largeSpeech.addChild(tRNA);
        largeSpeech.addChild(nucleotideGroup);
        prevBtn.visible = false;
        startBtn.visible = false;
        optionsBtn.visible = false;
        continueBtn.visible = false;
        proteinDisplayName.visible = false;
        talkCycles = game.rnd.integerInRange(3, 8);
        title.y += 50;
      } else if (chosenProtein === "") {
        proteinChooser();
      } else {
        pauseMenu();
      }

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
    function nextFunc() {
      page++;
      if(page === introContent.length - 1) {
        nextBtn.visible = false;
        startBtn.visible = true;
        optionsBtn.visible = true;
      }
      if(page > 0) {
        prevBtn.visible = true;
        title.visible = false;
      }
      if(page === 2) {
        tRNA.visible = true;
      } else {
        tRNA.visible = false;
      }
      if(page === 3 || page === 4) {
        nucleotideGroup.visible = true;
        nucleotideMover();
      } else {
        nucleotideGroup.visible = false;
      }
      interstitialText.text = introContent[page];
      talkCycles = game.rnd.integerInRange(3, 8);
    }

    function prevFunc() {
      if(page > 0) {
        page--;
      }
      if(page < introContent.length - 1) {
        nextBtn.visible = true;
        startBtn.visible = false;
        optionsBtn.visible = false;
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
      if(page === 3 || page === 4) {
        nucleotideGroup.visible = true;
        nucleotideMover();
      } else {
        nucleotideGroup.visible = false;
      }
      interstitialText.text = introContent[page];
    }

    function postIntroFunc() {
      intro = false;
      usersObj[currentKey].intro = false;
      usersObj[currentKey].proteinInProgress = "Insulin";
      usersObj.$save();
      prevBtn.destroy();
      nextBtn.destroy();
      startBtn.destroy();
      nucleotideGroup.forEachExists(function(child) {
        child.destroy();
      });
      nucleotideGroup.destroy();
      title.y -= 50;
      title.visible = true;
      optionsBtn.visible = true;
      continueBtn.visible = true;
      proteinDisplayName.visible = true;
      pauseMenu();
    }

    function proteinChooser() {
      
    }

    function pauseMenu() {
      interstitialText.boundsAlignH = "center";
      interstitialText.text = "\n\nCurrently building:";
    }

    function optionsFunc() {
      usersObj[currentKey].intro = false;
      usersObj.$save();
      window.location = "#/user";
    }

    function nucleotideMover() {
      if(page === 3) {
        Adenine.x = 150;
        Adenine.y = 330;
        Cytosine.x = 275;
        Cytosine.y = 330;
        Guanine.x = 395;
        Guanine.y = 330;
        Thymine.visible = true;
        Alanine.visible = false;
      }
      if(page === 4) {
        Adenine.x = 180;
        Adenine.y = 325;
        Cytosine.x = 165;
        Cytosine.y = 325;
        Guanine.x = 150;
        Guanine.y = 325;
        Thymine.visible = false;
        Alanine.visible = true;
      }
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

  }]);
});