define([
  "angular",
  "firebase",
  "bootstrap",
], function(angular, firebase, bootstrap) {
  angular.module("AminoApp.preload", [])
  .factory("preload", ["proteinPanic", function(proteinPanic) {

    var game = proteinPanic;

    return function() {
        game.load.spritesheet("facebook-btn", "images/facebook-btn.png", 246, 42);
        game.load.spritesheet("twitter-btn", "images/twitter-btn.png", 246, 42);
        game.load.spritesheet("github-btn", "images/github-btn.png", 246, 42);
        game.load.spritesheet("google-btn", "images/google-btn.png", 246, 42);
        game.load.spritesheet("resume_game", "images/resume_game.png", 252, 72);
        game.load.spritesheet("how_to_play", "images/how_to_play.png", 252, 72);
        game.load.spritesheet("new_game", "images/new_game.png", 252, 72);
        game.load.spritesheet("options", "images/options.png", 252, 72);
        game.load.spritesheet("ribosome", "images/Ribosome.png", 148, 155);
        game.load.spritesheet("riboeyes", "images/Ribosome-eyes.png", 83, 50);
        game.load.spritesheet("eyes", "images/tRNA-eyes.png", 70, 104);
        game.load.spritesheet("player", "images/tRNA.png", 70, 104);
        game.load.spritesheet("A", "images/Alanine.png", 60, 59);
        game.load.spritesheet("R", "images/Arginine.png", 60, 52);
        game.load.spritesheet("N", "images/Asparagine.png", 26, 60);
        game.load.spritesheet("D", "images/Aspartic_acid.png", 60, 58);
        game.load.spritesheet("C", "images/Cysteine.png", 60, 59);
        game.load.spritesheet("E", "images/Glutamic_acid.png", 30, 60);
        game.load.spritesheet("Q", "images/Glutamine.png", 60, 44);
        game.load.spritesheet("G", "images/Glycine.png", 60, 57);
        game.load.spritesheet("H", "images/Histidine.png", 59, 60);
        game.load.spritesheet("I", "images/Isoleucine.png", 60, 59);
        game.load.spritesheet("L", "images/Leucine.png", 59, 60);
        game.load.spritesheet("K", "images/Lysine.png", 60, 44);
        game.load.spritesheet("M", "images/Methionine.png", 43, 60);
        game.load.spritesheet("F", "images/Phenylalanine.png", 60, 60);
        game.load.spritesheet("P", "images/Proline.png", 60, 48);
        game.load.spritesheet("S", "images/Serine.png", 39, 60);
        game.load.spritesheet("T", "images/Threonine.png", 56, 60);
        game.load.spritesheet("W", "images/Tryptophan.png", 60, 31);
        game.load.spritesheet("Y", "images/Tyrosine.png", 60, 38);
        game.load.spritesheet("V", "images/Valine.png", 60, 60);
        game.load.image("splash", "images/splash_screen.png");
        game.load.image("background", "images/cell_bg.png");
        game.load.image("orline", "images/or_line.png");
        game.load.image("title", "images/title.png");
      };
  }]);
});