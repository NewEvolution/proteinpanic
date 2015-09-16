define([
  "angular",
], function(angular) {
  angular
  .module("AminoApp.proteinPanic", [])
  .factory("proteinPanic", function() {
    var game = new Phaser.Game(1024, 576, Phaser.AUTO, "gameTarget");
    return game;
  });
});