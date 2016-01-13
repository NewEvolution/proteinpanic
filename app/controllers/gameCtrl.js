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
  .controller("gameCtrl", ["$q", "$scope", "$firebaseArray", "$firebaseObject", "uid", "userCreator", "proteinPanic", "preload", "menuSplash",
  function($q, $scope, $firebaseArray, $firebaseObject, uid, userCreator, proteinPanic, preload, menuSplash) {

    // Debugging tool variables
    var noclip = false;
    var intenseDebug = false;
    
    var game = proteinPanic;

    var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
    var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
    var users = new Firebase("https://proteinpanic.firebaseio.com/users");
    var ref = new Firebase("https://proteinpanic.firebaseio.com");

    var usersObj = $firebaseObject(users);
    var usersArr = $firebaseArray(users);
    var proteinsArr;
    var aminiosArr;
    var initialLoad = true;
    var currentUID = null;
    var currentKey = null;
    var username = "";

    if(storageAvailable("localStorage")) {
       if(intenseDebug) {console.log("Local storage is available");}
      if(localStorage.getItem("proteins") && localStorage.getItem("aminos")) {
        if(intenseDebug) {console.log("Local storage has our data, use it");}
        proteinsArr = JSON.parse(localStorage.proteins);
        aminosArr = JSON.parse(localStorage.aminos);
      } else {
        if(intenseDebug) {console.log("Local storage does not have our data, wipe & fill it");}
        localStorage.clear();
        proteinsArr = $firebaseArray(proteins);
        aminosArr = $firebaseArray(aminos);
        aminosArr.$loaded().then(function(aminosData) {
          proteinsArr.$loaded().then(function(proteinsData) {
            localStorage.proteins = JSON.stringify(proteinsArr);
            localStorage.aminos = JSON.stringify(aminosArr);
          });
        });
      }
    } else {
      if(intenseDebug) {console.log("Local storage isn't available, boo");}
      proteinsArr = $firebaseArray(proteins);
      aminosArr = $firebaseArray(aminos);
    }
    
    this.arrayOfProteins = proteinsArr;
    this.arrayOfUsers = usersArr;
    this.selectedProtein = null;
    this.proteinSearch = "";
    $scope.proteinMenu = false;

    var authData = ref.getAuth();
    if(authData === null) {
      window.location = "/";
    } else {
      menuSplash.menusLoadedSetter(false);
      uid.setUid(authData.uid);
      currentUID = authData.uid;
      usersArr.$loaded().then(function(data) {
        var userDoesNotExist = true;
        for(var key in data) {
          if(data[key].uid === currentUID) {
            userDoesNotExist = false;
            mouse = data[key].mouse;
            intro = data[key].intro;
            currentKey = data[key].$id;
            username = data[key].username;
            musicVolume = data[key].music;
            effectsVolume = data[key].effects;
            ribosomeMuted = data[key].ribosomeMuted;
            checkpointInterval = data[key].checkpoint;
            playerColor = "0x" + data[key].color.slice(1);
            if(data[key].completedProteins) {
              completedProteins = data[key].completedProteins;
            }
            achievements = data[key].achievements;
            if (intro) {
              chosenProtein = "Insulin";
            } else if(data[key].proteinInProgress) {
              chosenProtein = data[key].proteinInProgress;
              remainingProteinLength = data[key].remainingProteinLength;
              if(remainingProteinLength === 0) {
                chosenProtein = "Insulin";
                remainingProteinLength = 110;
                goToProteinChooser = true;
              }
              if(intenseDebug) {console.log("Found a protein in progress: " + data[key].proteinInProgress);}
            } else {
              chosenProtein = "Insulin";
              remainingProteinLength = 110;
              goToProteinChooser = true;
              if(intenseDebug) {console.log("Didn't find a protein in progress");}
            }
          }
        }
        if(userDoesNotExist) {
          usersArr.$add(userCreator(currentUID));
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
    var mask;
    var dropA;
    var player;
    var hitbox;
    var Uracil;
    var prevBtn;
    var nextBtn;
    var cursors;
    var Adenine;
    var Guanine;
    var Alanine;
    var menuBtn;
    var impactA;
    var epicIcon;
    var longIcon;
    var Cytosine;
    var ribosome;
    var startBtn;
    var victoryV;
    var victoryI;
    var victoryC;
    var victoryT;
    var victoryO;
    var victoryR;
    var victoryY;
    var victoryX;
    var captureA;
    var fanfareA;
    var page = 0;
    var gameMusic;
    var ribounder;
    var toGetTime;
    var quickIcon;
    var cleanIcon;
    var vEpicIcon;
    var vLongIcon;
    var vCleanIcon;
    var vQuickIcon;
    var hiddenIcon;
    var pickupTime;
    var justLoaded;
    var riboSpeech;
    var optionsBtn;
    var aminoGroup;
    var codonGroup;
    var checkpoint;
    var proteinBtn;
    var titleGroup;
    var panicGroup;
    var pathV = [];
    var pathI = [];
    var pathC = [];
    var pathT = [];
    var pathO = [];
    var pathR = [];
    var pathY = [];
    var pathX = [];
    var vHiddenIcon;
    var dropoffTime;
    var checkpointA;
    var collectionA;
    var largeSpeech;
    var smallSpeech;
    var playerColor;
    var victoryText;
    var continueBtn;
    var progressBar;
    var victoryMusic;
    var achievementA;
    var victoryGroup;
    var toReturnTime;
    var proteinGroup;
    var carriedAmino;
    var _this = this;
    var intro = true;
    var hitCount = 0;
    var chosenProtein;
    var victoryBubble;
    var ribosomeMuted;
    var mouse = false;
    var tRNACW = true;
    var victoryPrevBtn;
    var victoryNextBtn;
    var victoryProtein;
    var progressHolder;
    var checkpointIcon;
    var letterStep = 0;
    var aminoCount = 0;
    var talkCycles = 0;
    var nucleotideGroup;
    var collectableName;
    var codonChain = [];
    var achievementsList;
    var checkAchieveText;
    var interstitialText;
    var victoryMoveMaker;
    var blinkCounter = 0;
    var fullProteinLength;
    var collectCodonGroup;
    var musicVolume = 1.0;
    var codonSliding = 45;
    var achievements = {};
    var collectDescription;
    var goToProteinChooser;
    var proteinDisplayName;
    var proteinAminos = [];
    var aminoToCollectGroup;
    var spinningOut = false;
    var effectsVolume = 1.0;
    var checkpointCount = 0;
    var cpVisibleTimer = 120;
    var mouthOpenCounter = 0;
    var carryingAmino = false;
    var controlsLocked = true;
    var remainingProteinLength;
    var completedProteins = "";
    var mouthClosedCounter = 0;
    var checkpointInterval = 10;
    var controlsDestroyed = false;
    var pointsV = [94, 74, 94, 94, 94, 94, 94, 94, 94, 94];
    var pointsI = [75, 75, 55, 75, 75, 75, 75, 75, 75, 75];
    var pointsC = [45, 45, 45, 25, 45, 45, 45, 45, 45, 45];
    var pointsT = [30, 30, 30, 30, 10, 30, 30, 30, 30, 30];
    var pointsO = [30, 30, 30, 30, 30, 10, 30, 30, 30, 30];
    var pointsR = [48, 48, 48, 48, 48, 48, 28, 48, 48, 48];
    var pointsY = [78, 78, 78, 78, 78, 78, 78, 58, 78, 78];
    var pointsX = [133, 133, 133, 133, 133, 133, 133, 133, 113, 133];
    var polygonPoints = [0,0, 0,481, 146,481, 146,576, 1024,576, 1024,0, 0,0];
    var introContent = [
      "",
      "Those little colorful beings bouncing around in the background are amino acids, the building blocks of proteins.\n\nAs a ribosome, my job is to assemble those amino acids in a specific order to build a protein, but there's more to it than that, and that's where you come in.",
      "You see, as a ribosome, I'm fixed in place in the wall of the rough endoplasmic reticulum that surrounds the nucleus of the cell.  I can't run off and grab the amino acids we need to build the protein.\n\nGrabbing the right amino acid is up to you, the transport RNA!",
      "The long colorful chain at the bottom of the screen is a strand of messenger RNA, and it gives us our instructions for building the protein.\n\nHow does it do that? Well, the colored bars sticking up from the RNA's green backbone are called nucleotides, and they come in one of four types:\n\nAdenine  Cytosine  Guanine  Uracil",
      "Every amino acid can be represented by three nucleotides in a specific order. This group of three nucleotides is called a codon, and every amino acid has at least one codon, though some have more.\n\nFor example:\n\nis a codon for Alanine",
      "I'll read the DNA one codon at a time and tell you which amino acid to catch. Once you've caught the amino acid, bring it back to me and I'll add it to the protein we're building.\n\nBe careful not to run into any of the other amino acids floating about, as they'll make you spin out and drop any amino acid you're carrying!",
      "Proteins can be very long, some contain thousands of amino acids! We'll start with a shorter one, but there will also be checkpoints along the way.\n\nOnce you've reached a checkpoint, you can restart from there later. You can change how often checkpoints happen in your user options.",
      "You control your flight around the inside of the cell with either the W A S D keys or arrow keys, or with your mouse/touch.\n\nYou can switch your control type on your user option screen as well.\n\nAt any time during the game you can click/tap on me to autosave, pause and check your progress.",
      "After completing a protein, or starting a new game you can choose your next protein to make.\n\nYou can only have one protein in progress at a time though, so starting a new protein will erase any progess you've made on an incomplete protein.",
      "That's the end of the introduction, you're now ready to start building your first protein!\n\nIf you'd like to see this intro again, you can check off \"Play Introduction\" in your user options.\n\nClick \"Start\" to start the game, or you can click \"Options\" to edit your user options."
    ];

    function gameGeneration() {
      codonChain = [];
      if(aminosArr.length !== 0 && proteinsArr.length !== 0) {
        generate();
      } else {
        aminosArr.$loaded().then(function(aminosData) {
          proteinsArr.$loaded().then(function(proteinsData) {
            generate();
          });
        });
      }
      function generate() {
        for(var p = 0; p < proteinsArr.length; p++) {
          if(proteinsArr[p].name === chosenProtein) {
            proteinAminos = proteinsArr[p].sequence.split(""); // Grab the list of amino acids & build the array to grab
            fullProteinLength = proteinAminos.length;
            for(var maf = 0; maf < proteinAminos.length; maf++) {
              if(proteinAminos[maf] === "B") { // Nonspecific amino acid
                var bRand = game.rnd.integerInRange(0, 1);
                if(bRand > 0) {
                  proteinAminos[maf] = "N";
                } else {
                  proteinAminos[maf] = "D";
                }
              }
              if(proteinAminos[maf] === "Z") { // Nonspecific amino acid
                var zRand = game.rnd.integerInRange(0, 1);
                if(zRand > 0) {
                  proteinAminos[maf] = "Q";
                } else {
                  proteinAminos[maf] = "E";
                }
              }
            }
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
          aminoGroup.forEachAlive(function(amino) {
            amino.kill();
          });
          codonGroup.removeAll(true, false);
          var toCollectAmino = aminoToCollectGroup.getFirstAlive();
          toCollectAmino.kill();
          for(var am = 0; am < 15; am++) {
            aminoStageCheck(true);
          }
          usersObj[currentKey].remainingProteinLength = fullProteinLength;
          codonSliding = 45;
          justLoaded = true;
          collectMaker();
          codonMaker(0);
          dnaMaker();
          pauseMenu();
        }
      }
    }

    function theGame() {
      introContent[0] = "Welcome to\n\n\nThe collection game where you can build all the proteins in the human body!\n\nHi " + username + "! My name's Riley, and I'm a ribosome. I'll be your guide throughout the game, but first, let's learn how to play.";
      game.state.add("theGame", {preload: preload, create: create, update: update}, true);
      game.state.remove("allMenus");
    }

//-------------------------------------------------------------------------------------------------      

    function create() {
      // Generic setup ##########################################################################
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.add.tileSprite(0, 0, 1200, 1200, "cell-bg");
      game.world.setBounds(0, 0, 1200, 1200);
      mask = game.add.graphics(0, 0);
      mask.beginFill(0x000000);
      mask.drawPolygon(polygonPoints);
      mask.fixedToCamera = true;

      // Audio ####################################################################################
      victoryMusic = game.add.audio("victory-a", musicVolume, true);
      gameMusic = game.add.audio("game-a", musicVolume, true);
      gameMusic.play();
      achievementA = game.add.audio("achievement-a", effectsVolume);
      checkpointA = game.add.audio("checkpoint-a", effectsVolume);
      collectionA = game.add.audio("collection-a", effectsVolume);
      fanfareA = game.add.audio("fanfare-a", effectsVolume);
      captureA = game.add.audio("capture-a", effectsVolume);
      impactA = game.add.audio("impact-a", effectsVolume);
      dropA = game.add.audio("drop-a", effectsVolume);
      riboSpeech = game.add.audio("speech-a");
      riboSpeech.allowMultple = true;
      riboSpeech.addMarker("1", 0.1, 0.15, effectsVolume);
      riboSpeech.addMarker("2", 0.3, 0.18, effectsVolume);
      riboSpeech.addMarker("3", 0.5, 0.32, effectsVolume);
      riboSpeech.addMarker("4", 0.9, 0.29, effectsVolume);
      riboSpeech.addMarker("5", 1.2, 0.25, effectsVolume);
      riboSpeech.addMarker("6", 1.5, 0.3, effectsVolume);
      riboSpeech.addMarker("7", 1.8, 0.29, effectsVolume);
      riboSpeech.addMarker("8", 2.1, 0.25, effectsVolume);
      riboSpeech.addMarker("9", 2.4, 0.17, effectsVolume);
      riboSpeech.addMarker("10", 2.6, 0.15, effectsVolume);
      riboSpeech.addMarker("11", 2.8, 0.18, effectsVolume);
      riboSpeech.addMarker("12", 3.0, 0.18, effectsVolume);
      riboSpeech.addMarker("13", 3.2, 0.18, effectsVolume);
      riboSpeech.addMarker("14", 3.4, 0.2, effectsVolume);
      riboSpeech.addMarker("15", 3.6, 0.27, effectsVolume);
      riboSpeech.addMarker("16", 3.9, 0.13, effectsVolume);
      riboSpeech.addMarker("17", 4.1, 0.15, effectsVolume);
      riboSpeech.addMarker("18", 4.3, 0.22, effectsVolume);
      riboSpeech.addMarker("19", 4.6, 0.18, effectsVolume);
      riboSpeech.addMarker("20", 4.8, 0.19, effectsVolume);
      riboSpeech.addMarker("21", 5.0, 0.2, effectsVolume);
      riboSpeech.addMarker("22", 5.2, 0.23, effectsVolume);
      riboSpeech.addMarker("23", 5.5, 0.37, effectsVolume);
      riboSpeech.addMarker("24", 5.9, 0.25, effectsVolume);
      riboSpeech.addMarker("25", 6.2, 0.3, effectsVolume);

      // Built protein ##########################################################################
      proteinGroup = game.add.group();
      proteinGroup.name = "proteinGroup";

      // Player #################################################################################
      player = game.add.sprite(100, 1100, "player");
      game.physics.arcade.enable(player);
      player.body.collideWorldBounds = true;
      eyes = game.add.sprite(0, 0, "eyes");
      player.anchor.setTo(0.5, 0.5);
      eyes.anchor.setTo(0.5, 0.5);
      game.camera.follow(player);
      player.tint = playerColor;
      player.addChild(eyes);
      player.mask = mask;

      // Amino swarm ############################################################################
      aminoGroup = game.add.group();
      aminoGroup.name = "aminoGroup";
      aminoGroup.enableBody = true;
      for (var i = 0; i < 15; i++) {
        var theAmino = "";
        if(i < 5 && proteinAminos[i] !== "STOP") {
          theAmino = proteinAminos[i];
        } else {
          while(theAmino === "" || theAmino === "STOP") { // The stop shouldn't be on stage...
            theAmino = game.rnd.pick(proteinAminos);
          }
        }
        var aminoX = 0;
        var aminoY = 1200;
        while(aminoX < 200 && aminoY > 1000) { // Don't spawn inside the ribosome
          aminoX = game.world.randomX;
          aminoY = game.world.randomY;
        }
        var anAmino = aminoGroup.create(aminoX, aminoY, theAmino);
        anAmino.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
        anAmino.rotation = game.rnd.realInRange(-0.2, 0.2);
        anAmino.body.bounce.y = 0.6 + Math.random() * 0.35;
        anAmino.body.bounce.x = 0.6 + Math.random() * 0.35;
        anAmino.body.collideWorldBounds = true;
        anAmino.anchor.setTo(0.5, 0.5);
      }

      // Ribosome & codon #######################################################################
      ribounder = game.add.sprite(20, 1034, "ribo-under");
      codonGroup = game.add.group();
      codonGroup.name = "codonGroup";
      dnaMaker();
      ribosome = game.add.sprite(20, 1034, "ribosome");
      game.physics.arcade.enable(ribosome);
      ribosome.body.immovable = true;
      ribosome.inputEnabled = true;
      riboeyes = game.add.sprite(65, 22, "riboeyes");
      ribosome.addChild(riboeyes);
      hitbox = game.add.sprite(20, 1124, "hitbox");
      game.physics.arcade.enable(hitbox);
      hitbox.body.immovable = true;

      // Small speech bubbble - collection instructions ###########################################
      smallSpeech = game.add.sprite(175, 440, "speech-bubble");
      smallSpeech.fixedToCamera = true;
      aminoToCollectGroup = game.add.group();
      aminoToCollectGroup.name = "aminoToCollectGroup";
      smallSpeech.addChild(aminoToCollectGroup);
      var aminoToCollect = aminoToCollectGroup.create(340, 4, proteinAminos[0]);
      aminoToCollect.y += (60 - aminoToCollect.height) / 2;
      aminoToCollect.x += (60 - aminoToCollect.width) / 2;
      collectCodonGroup = game.add.group();
      collectCodonGroup.name = "collectCodonGroup";
      smallSpeech.addChild(collectCodonGroup);
      var firstNucleotide = collectCodonGroup.create(50, 24, codonChain[0]);
      var secondtNucleotide = collectCodonGroup.create(65, 24, codonChain[1]);
      var thirdNucleotide = collectCodonGroup.create(80, 24, codonChain[2]);
      collectDescription = game.add.text(0, 0, "is a codon for", {font: "bold 16pt Arial", boundsAlignH: "center"});
      collectDescription.setTextBounds(110, 2, 225, 40);
      smallSpeech.addChild(collectDescription);
      collectableName = game.add.text(0, 0, getAminoName(proteinAminos[0]), {fill: "navy", boundsAlignH: "center"});
      collectableName.setTextBounds(110, 25, 225, 40);
      smallSpeech.addChild(collectableName);
      smallSpeech.visible = false;

      // Large speech bubble - intro/pause/success/protein selection ##############################
      largeSpeech = game.add.sprite(170, 80, "large-bubble");
      largeSpeech.fixedToCamera = true;
      interstitialText = game.add.text(0, 0, introContent[0], {align: "center", wordWrap: true, wordWrapWidth: 575});
      interstitialText.setTextBounds(65, 25, 575, 400);
      largeSpeech.addChild(interstitialText);
      proteinDisplayName = game.add.text(0, 0, chosenProtein, {
        font: "bold 26pt Arial",
        boundsAlignH: "center",
        boundsAlignV: "middle",
        wordWrapWidth: 575,
        align: "center",
        wordWrap: true,
        fill: "navy"
      });
      proteinDisplayName.setTextBounds(65, 130, 575, 125);
      largeSpeech.addChild(proteinDisplayName);
      titleGroup = game.add.group();
      largeSpeech.addChild(titleGroup);
      titleGroup.create(80, 20, "title");
      panicGroup = game.add.group();
      titleGroup.addChild(panicGroup);
      panicGroup.create(375, 20, "panic-p");
      panicGroup.create(420, 20, "panic-a");
      panicGroup.create(482, 20, "panic-n");
      panicGroup.create(540, 20, "panic-i");
      panicGroup.create(564, 20, "panic-c");
      progressHolder = game.add.sprite(73, 280, "progress-holder");
      largeSpeech.addChild(progressHolder);
      progressBar = game.add.sprite(78, 285, "progress-bar");
      largeSpeech.addChild(progressBar);
      startBtn = game.add.button(135, 365, "start-btn", startFunc, this, 0, 1, 2, 0);
      largeSpeech.addChild(startBtn);
      optionsBtn = game.add.button(365, 365, "options-btn", optionsFunc, this, 0, 1, 2, 0);
      largeSpeech.addChild(optionsBtn);
      continueBtn = game.add.button(135, 365, "continue-btn", continueFunc, this, 0, 1, 2, 0);
      largeSpeech.addChild(continueBtn);

      // Victory screen ###########################################################################
      victoryBubble = game.add.sprite(game.camera.width / 2, 10, "victory-bubble");
      victoryBubble.anchor.setTo(0.5, 0);
      victoryBubble.fixedToCamera = true;
      victoryGroup = game.add.group();
      victoryV = victoryGroup.create(-409, 94, "victory-v");
      victoryI = victoryGroup.create(-286, 75, "victory-i");
      victoryC = victoryGroup.create(-227, 45, "victory-c");
      victoryT = victoryGroup.create(-115, 30, "victory-t");
      victoryO = victoryGroup.create(0, 30, "victory-o");
      victoryR = victoryGroup.create(131, 48, "victory-r");
      victoryY = victoryGroup.create(257, 78, "victory-y");
      victoryX = victoryGroup.create(328, 133, "victory-x");
      victoryMoveMaker = [
        [victoryV, pathV, pointsV],
        [victoryI, pathI, pointsI],
        [victoryC, pathC, pointsC],
        [victoryT, pathT, pointsT],
        [victoryO, pathO, pointsO],
        [victoryR, pathR, pointsR],
        [victoryY, pathY, pointsY],
        [victoryX, pathX, pointsX]
      ];
      for(var vmm = 0; vmm < victoryMoveMaker.length; vmm++) {
        for(var vl = 0; vl <= 1; vl += 0.02) {
          var ty = game.math.catmullRomInterpolation(victoryMoveMaker[vmm][2], vl);
          victoryMoveMaker[vmm][1].push(ty);
        }
      }
      victoryBubble.addChild(victoryGroup);
      victoryText = game.add.text(0, 20, "", {align: "center", boundsAlignH: "center", wordWrap: true, wordWrapWidth: 575});
      victoryText.anchor.setTo(0.5, 0);
      victoryBubble.addChild(victoryText);
      victoryProtein = game.add.text(0, 250, "", {font: "bold 20pt Arial", fill: "green", align: "center", boundsAlignH: "center", wordWrap: true, wordWrapWidth: 575});
      victoryProtein.anchor.setTo(0.5, 0.5);
      victoryBubble.addChild(victoryProtein);
      achievementsList = game.add.text(-100, 65, "");
      achievementsList.lineSpacing = 20;
      victoryBubble.addChild(achievementsList);
      achievementsList.visible = false;
      proteinBtn = game.add.button(-110, 355, "protein-btn", proteinFunc, this, 0, 1, 2, 0);
      proteinBtn.anchor.setTo(0.5, 0);
      victoryBubble.addChild(proteinBtn);
      menuBtn = game.add.button(110, 355, "menu-btn", menuFunc, this, 0, 1, 2, 0);
      menuBtn.anchor.setTo(0.5, 0);
      victoryBubble.addChild(menuBtn);
      vEpicIcon = game.add.sprite(-135, 58, "epic");
      vEpicIcon.anchor.setTo(0.5, 0,5);
      vEpicIcon.scale.set(0.5);
      victoryBubble.addChild(vEpicIcon);
      vEpicIcon.visible = false;
      vHiddenIcon = game.add.sprite(-135, 115, "hidden");
      vHiddenIcon.anchor.setTo(0.5, 0,5);
      vHiddenIcon.scale.set(0.5);
      victoryBubble.addChild(vHiddenIcon);
      vHiddenIcon.visible = false;
      vLongIcon = game.add.sprite(-135, 172, "longhome");
      vLongIcon.anchor.setTo(0.5, 0,5);
      vLongIcon.scale.set(0.5);
      victoryBubble.addChild(vLongIcon);
      vLongIcon.visible = false;
      vQuickIcon = game.add.sprite(-135, 229, "quick");
      vQuickIcon.anchor.setTo(0.5, 0,5);
      vQuickIcon.scale.set(0.5);
      victoryBubble.addChild(vQuickIcon);
      vQuickIcon.visible = false;
      vCleanIcon = game.add.sprite(-135, 286, "clean");
      vCleanIcon.anchor.setTo(0.5, 0,5);
      vCleanIcon.scale.set(0.5);
      victoryBubble.addChild(vCleanIcon);
      vCleanIcon.visible = false;
      victoryPrevBtn = game.add.button(-200, 285, "prev-btn", victoryPrevFunc, this, 0, 1, 2, 0);
      victoryPrevBtn.anchor.setTo(0.5, 0);
      victoryBubble.addChild(victoryPrevBtn);
      victoryPrevBtn.visible = false;
      victoryNextBtn = game.add.button(200, 285, "next-btn", victoryNextFunc, this, 0, 1, 2, 0);
      victoryNextBtn.anchor.setTo(0.5, 0);
      victoryBubble.addChild(victoryNextBtn);
      victoryBubble.visible = false;

      // Checkpoint, achievements & pause button ##################################################
      checkpoint = game.add.sprite(game.camera.width / 2, 40, "checkpoint");
      checkpoint.anchor.setTo(0.5, 0.5);
      checkpoint.fixedToCamera = true;
      checkpoint.visible = false;
      checkAchieveText = game.add.text(0, 5, "");
      checkAchieveText.anchor.setTo(0.5, 0.5);
      checkpoint.addChild(checkAchieveText);
      checkpointIcon = game.add.sprite(-228, -25, "checkmark");
      checkpoint.addChild(checkpointIcon);
      checkpointIcon.visible = false;
      hiddenIcon = game.add.sprite(-270, -31, "hidden");
      checkpoint.addChild(hiddenIcon);
      hiddenIcon.visible = false;
      longIcon = game.add.sprite(-270, -31, "longhome");
      checkpoint.addChild(longIcon);
      longIcon.visible = false;
      quickIcon = game.add.sprite(-270, -31, "quick");
      checkpoint.addChild(quickIcon);
      quickIcon.visible = false;
      cleanIcon = game.add.sprite(-270, -31, "clean");
      checkpoint.addChild(cleanIcon);
      cleanIcon.visible = false;
      epicIcon = game.add.sprite(-270, -31, "epic");
      checkpoint.addChild(epicIcon);
      epicIcon.visible = false;

      // Introductory instructions ################################################################
      if(intro) {
        largeSpeech.visible = true;
        prevBtn = game.add.button(50, 355, "prev-btn", prevFunc, this, 0, 1, 2, 0);
        nextBtn = game.add.button(610, 355, "next-btn", nextFunc, this, 0, 1, 2, 0);
        nucleotideGroup = game.add.group();
        Adenine = nucleotideGroup.create(170, 360, "a");
        Cytosine = nucleotideGroup.create(295, 360, "c");
        Guanine = nucleotideGroup.create(415, 360, "g");
        Uracil = nucleotideGroup.create(520, 360, "u");
        Alanine = nucleotideGroup.create(495, 305, "A");
        nucleotideGroup.visible = false;
        Alanine.visible = false;
        tRNA = game.add.sprite(355, 368, "player");
        tRNA.anchor.setTo(0.5, 0.5);
        var t_eyes = game.add.sprite(0, 0, "eyes");
        t_eyes.anchor.setTo(0.5, 0.5);
        tRNA.addChild(t_eyes);
        tRNA.tint = playerColor;
        tRNA.scale.x = -1;
        tRNA.visible = false;
        largeSpeech.addChild(prevBtn);
        largeSpeech.addChild(nextBtn);
        largeSpeech.addChild(tRNA);
        largeSpeech.addChild(nucleotideGroup);
        prevBtn.visible = false;
        startBtn.visible = false;
        optionsBtn.visible = false;
        continueBtn.visible = false;
        progressBar.visible = false;
        progressHolder.visible = false;
        proteinDisplayName.visible = false;
        titleGroup.y += 50;
        setTimeout(function() {
          talkCycles = game.rnd.integerInRange(5, 10);
        }, 500);
      } else if (goToProteinChooser) {
        proteinChooser();
      } else {
        justLoaded = true;
        pauseMenu();
      }

    }

//-------------------------------------------------------------------------------------------------

    function update() {
      game.physics.arcade.collide(aminoGroup, aminoGroup, rotateBoth, null, this);
      game.physics.arcade.overlap(player, hitbox, inTheRibosome, null, this);
      if(!noclip) {game.physics.arcade.collide(player, aminoGroup, checkAmino, null, this);}
      game.physics.arcade.collide(ribosome, aminoGroup, nothing, null, this);

      // Game pausing ###########################################################################
      if(ribosome.input.pointerDown()) {
        pauseMenu();
      }

      // Protein in progress resuming #############################################################
      if((proteinAminos.length -1) > remainingProteinLength) {
        aminoGroup.getFirstAlive().kill();
        aminoCollectionRoutine();
        aminoStageCheck(true);
      }

      // Small speech buble relocation ############################################################
      // Ribosome following
      if(game.camera.x >= 0 && game.camera.x <= 175 && game.camera.y >= 490) {
        if(smallSpeech.cameraOffset.x < (175 - game.camera.x) - 30) {
          smallSpeech.cameraOffset.x += 30; // Extension
          aminoToCollectGroup.getFirstAlive().frame = 0;
        } else {
          smallSpeech.cameraOffset.x = 175 - game.camera.x; // Following
        }
      } else if(smallSpeech.cameraOffset.x >= -305) {
        smallSpeech.cameraOffset.x -= 30; // Retraction
        aminoToCollectGroup.getFirstAlive().frame = 1;
      }
      // Vertical sliding to avoid RNA chain
      if(game.camera.y !== 0) {
        var offset = 440 + (624 - game.camera.y);
        if(offset < 505) {
          smallSpeech.cameraOffset.y = offset;
        }
      }

      // Panic vibration ##########################################################################
      panicGroup.forEachExists(function(letter) {
        var anchors = {p: 375, a: 420, n: 482, i: 540, c: 564, y: 20};
        for(var keyName in anchors) {
          if(letter.key === "panic-" + keyName) {
            letter.x = game.rnd.realInRange((anchors[keyName] - 2),(anchors[keyName] + 2));
          }
          letter.y = game.rnd.realInRange((anchors.y - 2),(anchors.y + 2));
          letter.rotation = game.rnd.realInRange(-0.05, 0.05);
        }
      });

      // Ribosome blinking ########################################################################
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
          if(!ribosomeMuted) {
            var spokenWord = game.rnd.integerInRange(1, 25);
            riboSpeech.play(spokenWord);
          }
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

      // Intro tRNA rotation ####################################################################
      if(tRNA && tRNA.visible) {
        if(tRNACW) {
          if(tRNA.rotation < 0.2) {
            tRNA.rotation = (Math.round((tRNA.rotation + 0.01) * 100)) / 100; // JavaScript really does not like floats
          } else {
            tRNACW = false;
          }
        } else {
          if(tRNA.rotation > -0.2) {
            tRNA.rotation = (Math.floor((tRNA.rotation - 0.01) * 100)) / 100; // JavaScript really does not like floats
          } else {
            tRNACW = true;
          }
        }
      }

      // Checkpoint popup #######################################################################
      if(checkpoint.visible) {
        if(cpVisibleTimer > 10) {
          cpVisibleTimer--;
        } else if(cpVisibleTimer > 0) {
          checkpoint.alpha -= 0.1;
          cpVisibleTimer--;
        } else {
          checkpointIcon.visible = false;
          hiddenIcon.visible = false;
          quickIcon.visible = false;
          cleanIcon.visible = false;
          longIcon.visible = false;
          epicIcon.visible = false;
          checkpoint.visible = false;
          cpVisibleTimer = 60;
          checkpoint.alpha = 1;
        }
      }

      // Victory letter jumping ###################################################################
      if(victoryBubble.visible && victoryGroup.visible) {
        for(var lj = 0; lj < victoryMoveMaker.length; lj++) {
          victoryMoveMaker[lj][0].y = victoryMoveMaker[lj][1][letterStep];
        }
        letterStep++;
        if(letterStep >= pathV.length) {
          letterStep = 0;
        }
      }

      // Player Motion ##########################################################################
      player.frame = 0;
      eyes.frame = 0;
      if(spinningOut) {
        player.rotation += 0.5;
      } else if(!controlsLocked) {
        if(mouse) { // Mouse-follow controls
          game.physics.arcade.moveToPointer(player, 60, game.input.activePointer, 400);
        } else { // Keyboard controls
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
        if(liveAmino.body.velocity.x > 0 && liveAmino.frame === 0) {
          liveAmino.frame = 1;
        } else if(liveAmino.body.velocity.x < 0 && liveAmino.frame === 1) { 
          liveAmino.frame = 0;
        }
      });

      // Codons on stage management #############################################################
      codonGroup.forEachAlive(function(theCodon) {
        if(theCodon.x < -15) {
          theCodon.destroy();
        }
      });
      if(codonSliding < 45) {
        codonGroup.addAll("x", -1, true);
        codonSliding++;
      }

      // Assembled protein on stage management ##################################################
      proteinGroup.forEachAlive(function(proteinAmino) {
        if(proteinAmino.scale.y < 0.08) {
          proteinAmino.kill();
        }
      });

    }

//-------------------------------------------------------------------------------------------------

  function onExit() {
    controlsDestroyed = true;
    gameMusic.stop();
    victoryMusic.stop();
    game.input.keyboard.clearCaptures();
  }

//-------------------------------------------------------------------------------------------------

    function render() {
      game.debug.body(hitbox);
      game.debug.cameraInfo(game.camera, 32, 32);
      game.debug.spriteCoords(player, 32, 500);
    }

//-------------------------------------------------------------------------------------------------

    // Called functions #######################################################################
    function storageAvailable(type) {
      try {
        var storage = window[type],
          x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      }
      catch(e) {
        return false;
      }
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
        titleGroup.visible = true;
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

    function nextFunc() {
      page++;
      if(page === introContent.length - 1) {
        nextBtn.visible = false;
        startBtn.visible = true;
        optionsBtn.visible = true;
      }
      if(page > 0) {
        prevBtn.visible = true;
        titleGroup.visible = false;
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
      talkCycles = game.rnd.integerInRange(5, 10);
    }

    function nucleotideMover() {
      if(page === 3) {
        Adenine.x = 170;
        Adenine.y = 360;
        Cytosine.x = 295;
        Cytosine.y = 360;
        Guanine.x = 415;
        Guanine.y = 360;
        Uracil.visible = true;
        Alanine.visible = false;
      }
      if(page === 4) {
        Adenine.x = 180;
        Adenine.y = 325;
        Cytosine.x = 165;
        Cytosine.y = 325;
        Guanine.x = 150;
        Guanine.y = 325;
        Uracil.visible = false;
        Alanine.visible = true;
      }
    }

    function startFunc() {
      if(goToProteinChooser) {
        if(_this.selectedProtein === null) {
          alert("Please select a protein to build.");
        } else {
          $scope.proteinMenu = false;
          $scope.$apply();
          chosenProtein = _this.selectedProtein;
          usersObj[currentKey].proteinInProgress = chosenProtein;
          remainingProteinLength = 2750000000000;
          gameGeneration();
        }
      } else {
        intro = false;
        usersObj[currentKey].intro = false;
        usersObj[currentKey].proteinInProgress = "Insulin";
        usersObj[currentKey].remainingProteinLength = proteinAminos.length;
        usersObj.$save();
        prevBtn.destroy();
        nextBtn.destroy();
        nucleotideGroup.forEachExists(function(child) {
          child.destroy();
        });
        nucleotideGroup.destroy();
        titleGroup.y -= 50;
        titleGroup.visible = true;
        startBtn.visible = false;
        optionsBtn.visible = true;
        continueBtn.visible = true;
        goToProteinChooser = true;
        proteinChooser();
      }
    }

    function proteinChooser() {
      game.input.keyboard.clearCaptures();
      $scope.proteinMenu = true;
      $scope.$apply();
      startBtn.visible = true;
      largeSpeech.visible = true;
      continueBtn.visible = false;
      smallSpeech.visible = false;
      progressBar.visible = false;
      progressHolder.visible = false;
      interstitialText.visible = false;
      proteinDisplayName.visible = false;
    }

    function pauseMenu() {
      noclip = true;
      controlsLocked = true;
      startBtn.visible = false;
      continueBtn.visible = true;
      largeSpeech.visible = true;
      progressBar.visible = true;
      smallSpeech.visible = false;
      progressHolder.visible = true;
      interstitialText.visible = true;
      proteinDisplayName.visible = true;
      proteinDisplayName.text = chosenProtein;
      talkCycles = game.rnd.integerInRange(3, 5);
      if(remainingProteinLength >= proteinAminos.length - 1 || !remainingProteinLength) {
        remainingProteinLength = proteinAminos.length - 1;
        usersObj[currentKey].remainingProteinLength = remainingProteinLength;
        usersObj.$save();
      }
      if(justLoaded) {
        checkpointCount = Math.floor((fullProteinLength - remainingProteinLength) / checkpointInterval);
      }
      progressBar.scale.x = (fullProteinLength - remainingProteinLength) / fullProteinLength; 
      interstitialText.boundsAlignH = "center";
      interstitialText.text = "\n\nCurrently building:\n\n\n\nCheckpoint " + checkpointCount + " of " + Math.floor(fullProteinLength/checkpointInterval) + "\n\n" + (fullProteinLength - remainingProteinLength) + " of " + fullProteinLength + " amino acids collected!";
    }

    function optionsFunc() {
      usersObj[currentKey].intro = false;
      usersObj.$save();
      onExit();
      window.location = "#/user";
    }

    function continueFunc() {
      if(!mouse && !cursors) {
        createControls();
      }
      noclip = false;
      if(justLoaded) {
        codonSliding -= 45;
        justLoaded = false;
        aminoStageCheck(true);
      }
      largeSpeech.visible = false;
      smallSpeech.visible = true;
      if(controlsDestroyed) {
        controlsDestroyed = false;
        createControls();
      }
      controlsLocked = false;
      talkCycles = game.rnd.integerInRange(3, 5);
    }

    function victoryPrevFunc() {
      achievementsList.visible = false;
      victoryPrevBtn.visible = false;
      victoryProtein.visible = true;
      victoryNextBtn.visible = true;
      vHiddenIcon.visible = false;
      vCleanIcon.visible = false;
      vQuickIcon.visible = false;
      vEpicIcon.visible = false;
      vLongIcon.visible = false;
      victoryGroup.visible = true;
      victoryText.text = "\n\n\n\nYou built\n\n\n\nfrom " + fullProteinLength + " amino acids!";
    }

    function victoryNextFunc() {
      achievementsList.visible = true;
      victoryNextBtn.visible = false;
      victoryProtein.visible = false;
      victoryPrevBtn.visible = true;
      vHiddenIcon.visible = true;
      vCleanIcon.visible = true;
      vQuickIcon.visible = true;
      vEpicIcon.visible = true;
      vLongIcon.visible = true;
      victoryGroup.visible = false;
      victoryText.text = "This Protein's Achievements";
    }

    function proteinFunc() {
      victoryMusic.stop();
      window.location.reload();
    }

    function menuFunc() {
      onExit();
      window.location = "#/menu";
    }

    _this.hideCompleted = function(proteinName) {
      if(completedProteins.indexOf(proteinName) > -1){
        return false;
      }
      return true;
    };

//-------------------------------------------------------------------------------------------------

    function createControls() {
      wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
      aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
      sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
      dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
      cursors = game.input.keyboard.createCursorKeys();
    }

    function getAminoName(value) {
      for (var aa = 0; aa < aminosArr.length; aa++) {
        if (aminosArr[aa].code == value) return aminosArr[aa].name;
      }
    }

    function dnaMaker() {
      for (var c = 0; c <codonChain.length; c++) {
        var nucleotide = codonGroup.create(134 + (15 * c), 1144, codonChain[c]);
      }
    }

    function codonMaker(codonSeqStart) {
      for(var rn = 0; rn < 3; rn++) {
        var promisedNucleotide = spriteRevival(collectCodonGroup, codonChain[(codonSeqStart + rn)], 50 + (15 * rn), 24);
      }
    }

    function collectMaker() {
      var promisedAminoToCollect = spriteRevival(aminoToCollectGroup, proteinAminos[0], 340, 4);
      collectableName.text = getAminoName(proteinAminos[0]);
      promisedAminoToCollect.then(function(aminoToCollect) {
        aminoToCollect.y += (60 - aminoToCollect.height) / 2;
        aminoToCollect.x += (60 - aminoToCollect.width) / 2;
      });
    }

    function inTheRibosome() {
      dropoffTime = game.time.now;
      if(carriedAmino !== undefined && carryingAmino === true) {
        if(intenseDebug) {
          console.log("Entering Ribosome --------------------------------------------------------");
          aminoGroup.forEachAlive(function(liveAmino) {
            console.log("liveAmino = ", liveAmino.key);
          });
        }
        toReturnTime = dropoffTime - pickupTime;
        talkCycles = game.rnd.integerInRange(3, 5);
        collectionA.play();
        aminoCollectionRoutine(true);
        carriedAmino.destroy();
        carryingAmino = false;
        hitCount = 0;
      }
    }

    function aminoCollectionRoutine(inRibosome) {
      codonSliding -= 45;
      collectCodonGroup.forEachAlive(function(liveNucleotide) {
        liveNucleotide.kill();
      });
      aminoCount++;
      var codonSeqStart = aminoCount * 3;
      if(intenseDebug) {console.log("Building Codon -----------------------------------------------------------");}
      codonMaker(codonSeqStart);
      if(intenseDebug) {console.log("Building Protein ---------------------------------------------------------");}
      var promisedAssembledAmino = spriteRevival(proteinGroup, proteinAminos[0], 60, 1024);
      promisedAssembledAmino.then(function(assembledAmino) {
        assembledAmino.scale.set(1);
        proteinGroup.addAll("y", -5, true);
        proteinGroup.addAll("scale.x", -0.025, true);
        proteinGroup.addAll("scale.y", -0.025, true);
      }); 
      proteinAminos.splice(0, 1);
      if(inRibosome) {
        achievementRoutine();
        if(proteinAminos.length === 1) {
          // Protein completed
          gameMusic.stop();
          fanfareA.play();
          setTimeout(function() {
            victoryMusic.play();
          }, 4000);
          noclip = true;
          controlsLocked = true;
          victoryBubble.visible = true;
          victoryProtein.text = chosenProtein;
          victoryText.text = "\n\n\n\nYou built\n\n\n\nfrom " + fullProteinLength + " amino acids!";
          achievements.totalHiddenAminoAcids = achievements.totalHiddenAminoAcids + achievements.hiddenAminoAcids;
          achievements.totalCleanCollections = achievements.totalCleanCollections + achievements.cleanCollections;
          achievements.totalQuickCollections = achievements.totalQuickCollections + achievements.quickCollections;
          achievements.totalEpicCollections = achievements.totalEpicCollections + achievements.epicCollections;
          achievements.totalLongWayHomes = achievements.totalLongWayHomes + achievements.longWayHomes;
          achievementsList.text = achievements.epicCollections + " - Epic Collections\n" +
            achievements.hiddenAminoAcids + " - Hidden Amino Acids\n" +
            achievements.longWayHomes + " - Long Way Homes\n" +
            achievements.quickCollections + " - Quick Collections\n" +
            achievements.cleanCollections + " - Clean Collections";
          achievements.hiddenAminoAcids = 0;
          achievements.cleanCollections = 0;
          achievements.quickCollections = 0;
          achievements.epicCollections = 0;
          achievements.longWayHomes = 0;
          usersObj[currentKey].completedProteins = completedProteins + (chosenProtein + ",");
          usersObj[currentKey].achievements = achievements;
          usersObj[currentKey].remainingProteinLength = 0;
          usersObj.$save();
        }
        remainingProteinLength = proteinAminos.length - 1;
        if((fullProteinLength - remainingProteinLength) % checkpointInterval === 0) {
          checkpointCount++;
          checkAchieveText.text = "Checkpoint " + checkpointCount + " of " + Math.floor(fullProteinLength / checkpointInterval) + "!";
          checkpointA.play();
          checkpointIcon.visible = true;
          checkpoint.visible = true;
          usersObj[currentKey].remainingProteinLength = remainingProteinLength;
          usersObj[currentKey].achievements = achievements;
          usersObj.$save();
        }
      }
      var justCollectedAmino = aminoToCollectGroup.getFirstAlive();
      justCollectedAmino.kill();
      if(intenseDebug) {console.log("Building Collection Icon -------------------------------------------------");}
      collectMaker();
    }

    function achievementRoutine() {
      if(hitCount === 0) {
        achievementA.play();
        if((toGetTime + toReturnTime) > 14000) {
          achievements.epicCollections++;
          checkAchieveText.text = "Epic Collection!";
          epicIcon.visible = true;
          checkpoint.visible = true;
        } else if(toGetTime > 7000) {
          achievements.hiddenAminoAcids++;
          checkAchieveText.text = "Hidden Amino!";
          hiddenIcon.visible = true;
          checkpoint.visible = true;
        } else if(toReturnTime > 7000) {
          achievements.longWayHomes++;
          checkAchieveText.text = "Long Way Home!";
          longIcon.visible = true;
          checkpoint.visible = true;
        } else if((toGetTime + toReturnTime) < 3000) {
          achievements.quickCollections++;
          checkAchieveText.text = "Quick Collection!";
          quickIcon.visible = true;
          checkpoint.visible = true;
        } else {
          achievements.cleanCollections++;
          checkAchieveText.text = "Clean Collection!";
          cleanIcon.visible = true;
          checkpoint.visible = true;
        }
      }
    }

    function checkAmino (player, theAmino) {
      if(proteinAminos[0] === theAmino.key && carryingAmino === false) {
        pickupTime = game.time.now;
        toGetTime = pickupTime - dropoffTime;
        goodAmino(player, theAmino);
      } else {
        hitCount++;
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
        captureA.play();
        carriedAmino = game.add.sprite(0, -62, theAmino.key);
        carriedAmino.anchor.setTo(0.5, 0.5);
        player.addChild(carriedAmino);
        aminoStageCheck(false);
      }
    }

    function aminoStageCheck(worldPopulate) {
      var aliveCount = 0;
      var neededAmino = "";
      var neededAminoAvailable = false;
      if(worldPopulate) {
        neededAmino = proteinAminos[0];
      } else {
        neededAmino = proteinAminos[1];
      }
      aminoGroup.forEachAlive(function(liveAmino) {
        if(intenseDebug) {console.log("liveAmino = ", liveAmino.key);}
        aliveCount++;
        if(liveAmino.key === neededAmino) { // Check to see if the amino we need next is on stage & alive
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
          theNewAmino = neededAmino; // otherwise, toss the one we need on stage.
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
        dropA.play();
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
      } else {
        impactA.play();
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