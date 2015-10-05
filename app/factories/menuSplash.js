define([
  "angular",
], function(angular) {
  angular
  .module("AminoApp.menuSplash", [])
  .factory("menuSplash", ["$q", "proteinPanic", "preload", function($q, proteinPanic, preload) {

    var game = proteinPanic;

    var allAminos = ["D", "E", "F", "N", "I", "M", "W", "Q", "H", "T", "R", "C", "Y", "A", "G", "L", "P", "K", "S", "U", "V"];

    var valine;
    var valinePoints = {
      x: [57, 57, 67, 67, 57],
      y: [70, 80, 80, 70, 70]
    };
    var valineRotating = false;
    var valinePath = [];
    var valineStep = 0;
    var valRot = 0;

    var arginine;
    var argininePoints = {
      x: [725, 745, 725, 705, 725],
      y: [485, 505, 525, 505, 485]
    };
    var arginineRotating = false;
    var argininePath = [];
    var arginineStep = 0;
    var argRot = 0;

    var trna;
    var trnaPoints = {
      x: [260, 280, 260, 240, 260],
      y: [121, 101, 131, 101, 121]
    };
    var trnaRotating = false;
    var trnaPath = [];
    var trnaStep = 0;
    var trnaRot = 0;

    var title;
    var trnaEyes;
    var menuGroup;
    var menuMusic;
    var aminoGroup;
    var background;
    var panicGroup;
    var hasTitle = true;
    var musicVolume = 1;
    var currentVolume = 1;
    var trnaTint = 0x00FF00;
    var menusLoaded = false;

    return {
      hasTitleSetter: function(value) {
        hasTitle = value;
      },
      trnaTintSetter: function(value) {
        trnaTint = value;
      },
      volumeSetter: function(value) {
        musicVolume = value;
      },
      musicStopper: function() {
        menuMusic.stop();
      },
      menusLoadedSetter: function(value) {
        menusLoaded = value;
      },
      menusLoadedGetter: function() {
        return menusLoaded;
      },
      menuStarter: function() {
        return allMenus();
      }
    };

    function allMenus() {
      var deferred = $q.defer();
      game.state.add("allMenus", {preload: preload, create: create, update: update}, true);

      function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1200, 1200);
        game.add.tileSprite(0, 0, 1200, 1200, "cell-bg");
        game.camera.x = (game.world.width - game.camera.width) / 2;
        game.camera.y = (game.world.height - game.camera.height) / 2;
        menuMusic = game.add.audio("menu-a", musicVolume, true);
        menuMusic.play();

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
        for(var vi = 0; vi <= 1; vi += 0.005) {
          var vx = game.math.catmullRomInterpolation(valinePoints.x, vi);
          var vy = game.math.catmullRomInterpolation(valinePoints.y, vi);
          valinePath.push( { x: vx, y: vy });
        }

        // Arginine
        arginine = menuGroup.create(725, 485, "splash-arginine");
        arginine.anchor.setTo(0.5, 0.5);
        for(var ai = 0; ai <= 1; ai += 0.002) {
          var ax = game.math.catmullRomInterpolation(argininePoints.x, ai);
          var ay = game.math.catmullRomInterpolation(argininePoints.y, ai);
          argininePath.push( { x: ax, y: ay });
        }

        // tRNA
        trna = menuGroup.create(270, 121, "splash-trna");
        trna.anchor.setTo(0.5, 0.5);
        trna.tint = trnaTint;
        trnaEyes = menuGroup.create(-35, -58, "splash-trna-eyes");
        trna.addChild(trnaEyes);
        for(var ti = 0; ti <= 1; ti += 0.001) {
          var tx = game.math.catmullRomInterpolation(trnaPoints.x, ti);
          var ty = game.math.catmullRomInterpolation(trnaPoints.y, ti);
          trnaPath.push( { x: tx, y: ty });
        }

        // Menu block #############################################################################
        title = menuGroup.create(433, 38, "title");
        panicGroup = game.add.group();
        menuGroup.addChild(panicGroup);
        panicGroup.create(728, 38, "panic-p");
        panicGroup.create(773, 38, "panic-a");
        panicGroup.create(835, 38, "panic-n");
        panicGroup.create(893, 38, "panic-i");
        panicGroup.create(917, 38, "panic-c");
        deferred.resolve();
      }
      return deferred.promise;
    }

    function update() {
      // Music volume ###########################################################################
      if(currentVolume !== musicVolume) {
        menuMusic.volume = musicVolume;
        currentVolume = musicVolume;
      }
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

      // tRNA movement ######################################################################
      if(trnaTint && trna.tint != trnaTint) {
        trna.tint = trnaTint;
      }
      trna.x = trnaPath[trnaStep].x;
      trna.y = trnaPath[trnaStep].y;
      trnaStep++;
      if(trnaStep >= trnaPath.length) {
        trnaStep = 0;
      }
      if(!trnaRotating) {
        trnaRotating = true;
        trnaRot = (game.rnd.integerInRange(-500, 0) / 1000); // JavaScript & floating points do NOT get along nicely
      }
      if(trna.rotation < trnaRot) {
        trna.rotation = (Math.round((trna.rotation + 0.001) * 1000)) / 1000; // See above
      } else if(trna.rotation > trnaRot) {
        trna.rotation = (Math.floor((trna.rotation - 0.001) * 1000)) / 1000; // Ditto
      } else {
        trnaRotating = false;
      }

      // Panic vibration ########################################################################
      if(hasTitle) {
        if(!title.visible || ! panicGroup.visible) {
          title.visible = true;
          panicGroup.visible = true;
        }
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
      } else {
        if(title.visible || panicGroup.visible) {
          title.visible = false;
          panicGroup.visible = false;
        }
      }
    }

    function rotateBoth(item1, item2) {
      item1.rotation = game.rnd.realInRange(-0.2, 0.2);
      item2.rotation = game.rnd.realInRange(-0.2, 0.2);
    }

  }]);
});