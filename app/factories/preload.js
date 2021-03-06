define([
  "angular",
], function(angular) {
  angular.module("AminoApp.preload", [])
  .factory("preload", ["proteinPanic", function(proteinPanic) {

    var game = proteinPanic;

    return function() {
        game.stage.backgroundColor = 0x79C2B4;
        game.load.spritesheet("view-statistics", "images/view-statistics.png", 534, 53);
        game.load.spritesheet("facebook-btn", "images/facebook-btn.png", 246, 42);
        game.load.spritesheet("continue-btn", "images/continue-btn.png", 192, 42);
        game.load.spritesheet("edit-options", "images/edit-options.png", 534, 53);
        game.load.spritesheet("twitter-btn", "images/twitter-btn.png", 246, 42);
        game.load.spritesheet("options-btn", "images/options-btn.png", 192, 42);
        game.load.spritesheet("protein-btn", "images/protein-btn.png", 192, 42);
        game.load.spritesheet("github-btn", "images/github-btn.png", 246, 42);
        game.load.spritesheet("google-btn", "images/google-btn.png", 246, 42);
        game.load.spritesheet("start-game", "images/start-game.png", 534, 53);
        game.load.spritesheet("riboeyes", "images/Ribosome-eyes.png", 83, 50);
        game.load.spritesheet("start-btn", "images/start-btn.png", 192, 42);
        game.load.spritesheet("ribosome", "images/Ribosome.png", 148, 155);
        game.load.spritesheet("menu-btn", "images/menu-btn.png", 192, 42);
        game.load.spritesheet("next-btn", "images/next-btn.png", 34, 61);
        game.load.spritesheet("prev-btn", "images/prev-btn.png", 34, 61);
        game.load.spritesheet("U", "images/Selenocysteine.png", 59, 60);
        game.load.spritesheet("eyes", "images/tRNA-eyes.png", 71, 106);
        game.load.spritesheet("D", "images/Aspartic_acid.png", 60, 58);
        game.load.spritesheet("E", "images/Glutamic_acid.png", 30, 60);
        game.load.spritesheet("F", "images/Phenylalanine.png", 60, 60);
        game.load.spritesheet("player", "images/tRNA.png", 71, 106);
        game.load.spritesheet("N", "images/Asparagine.png", 26, 60);
        game.load.spritesheet("I", "images/Isoleucine.png", 60, 59);
        game.load.spritesheet("M", "images/Methionine.png", 43, 60);
        game.load.spritesheet("W", "images/Tryptophan.png", 60, 31);
        game.load.spritesheet("Q", "images/Glutamine.png", 60, 44);
        game.load.spritesheet("H", "images/Histidine.png", 59, 60);
        game.load.spritesheet("T", "images/Threonine.png", 56, 60);
        game.load.spritesheet("R", "images/Arginine.png", 60, 52);
        game.load.spritesheet("C", "images/Cysteine.png", 60, 59);
        game.load.spritesheet("Y", "images/Tyrosine.png", 60, 38);
        game.load.spritesheet("A", "images/Alanine.png", 60, 59);
        game.load.spritesheet("G", "images/Glycine.png", 60, 57);
        game.load.spritesheet("L", "images/Leucine.png", 59, 60);
        game.load.spritesheet("P", "images/Proline.png", 60, 48);
        game.load.spritesheet("X", "images/Unknown.png", 60, 60);
        game.load.spritesheet("K", "images/Lysine.png", 60, 44);
        game.load.spritesheet("S", "images/Serine.png", 39, 60);
        game.load.spritesheet("V", "images/Valine.png", 60, 60);
        game.load.image("splash-trna-eyes", "images/SplashtRNA-eyes.png");
        game.load.image("progress-holder", "images/progress-holder.png");
        game.load.image("splash-arginine", "images/SplashArginine.png");
        game.load.image("victory-bubble", "images/victory-bubble.png");
        game.load.image("speech-bubble", "images/speech-bubble.png");
        game.load.image("splash-valine", "images/SplashValine.png");
        game.load.image("progress-bar", "images/progress-bar.png");
        game.load.image("large-bubble", "images/large-bubble.png");
        game.load.image("ribo-under", "images/Ribosome-under.png");
        game.load.image("splash-ribo", "images/SplashRibo.png");
        game.load.image("splash-trna", "images/SplashtRNA.png");
        game.load.image("checkpoint", "images/checkpoint.png");
        game.load.image("victory-v", "images/victory-v.png");
        game.load.image("victory-i", "images/victory-i.png");
        game.load.image("victory-c", "images/victory-c.png");
        game.load.image("victory-t", "images/victory-t.png");
        game.load.image("victory-o", "images/victory-o.png");
        game.load.image("victory-r", "images/victory-r.png");
        game.load.image("victory-y", "images/victory-y.png");
        game.load.image("victory-x", "images/victory-x.png");
        game.load.image("checkmark", "images/checkmark.png");
        game.load.image("longhome", "images/longhome.png");
        game.load.image("cell-bg", "images/cell-bg.png");
        game.load.image("orline", "images/or-line.png");
        game.load.image("hitbox", "images/hitbox.png");
        game.load.image("hidden", "images/hidden.png");
        game.load.image("x", "images/UnknownNuc.png");
        game.load.image("title", "images/title.png");
        game.load.image("clean", "images/clean.png");
        game.load.image("quick", "images/quick.png");
        game.load.image("c", "images/Cytosine.png");
        game.load.image("panic-p", "images/p.png");
        game.load.image("panic-a", "images/a.png");
        game.load.image("panic-n", "images/n.png");
        game.load.image("panic-i", "images/i.png");
        game.load.image("panic-c", "images/c.png");
        game.load.image("epic", "images/epic.png");
        game.load.image("STOP", "images/STOP.png");
        game.load.image("a", "images/Adenine.png");
        game.load.image("g", "images/Guanine.png");
        game.load.image("u", "images/Uracil.png");
        game.load.audio("achievement-a", "audio/Achievement.ogg");
        game.load.audio("checkpoint-a", "audio/Checkpoint.ogg");
        game.load.audio("collection-a", "audio/Collection.ogg");
        game.load.audio("capture-a", "audio/Capture.ogg");
        game.load.audio("victory-a", "audio/Victory.ogg");
        game.load.audio("fanfare-a", "audio/Fanfare.ogg");
        game.load.audio("speech-a", "audio/Speech.ogg");
        game.load.audio("impact-a", "audio/Impact.ogg");
        game.load.audio("drop-a", "audio/Drop.ogg");
        game.load.audio("menu-a", "audio/Menu.ogg");
        game.load.audio("game-a", "audio/Game.ogg");
      };
  }]);
});
