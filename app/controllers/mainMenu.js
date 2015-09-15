define([
  "angular",
  "firebase",
  "bootstrap", 
  "angularRoute",
], function(angular, firebase, bootstrap, angularRoute) {
  angular.module("AminoApp.menu", ["ngRoute"])
  .controller("menuCtrl", ["$firebaseArray", "uid", function($firebaseArray, uid) {

    return function() {
      game.state.add("mainMenu", {preload: preload, create: create});
      game.state.start("mainMenu");

      var githubBtn;
      var googleBtn;
      var twitterBtn;
      var facebookBtn;

      function preload() {
        game.load.image("facebook-btn", "images/facebook-btn.png");
        game.load.image("twitter-btn", "images/twitter-btn.png");
        game.load.image("github-btn", "images/github-btn.png");
        game.load.image("google-btn", "images/google-btn.png");
      }

      function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, "splash");
        facebookBtn = game.add.button(50, 275, "facebook-btn", serviceAuth("facebook"), this);
        twitterBtn = game.add.button(50, 275, "twitter-btn", serviceAuth("twitter"), this);
        githubBtn = game.add.button(50, 275, "github-btn", serviceAuth("github"), this);
        googleBtn = game.add.button(50, 275, "google-btn", serviceAuth("google"), this);
      }

    };
  }]);
});