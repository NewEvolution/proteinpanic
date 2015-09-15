define([
	"angular",
	"angularRoute",
	"firebase",
	"bootstrap", 
], function(angular, angularRoute, firebase, bootstrap) {
	angular.module("AminoApp.game", ["ngRoute"])
	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/game", {
			templateUrl: "../partials/game.html",
			controller: "gameCtrl",
			controllerAs: "game"
		});
	}])
	.controller("gameCtrl", ["$firebaseArray", "uid", function($firebaseArray, uid) {

		var proteins = new Firebase("https://proteinpanic.firebaseio.com/proteins");
		var aminos = new Firebase("https://proteinpanic.firebaseio.com/aminos");
		var users = new Firebase("https://proteinpanic.firebaseio.com/users");
		var ref = new Firebase("https://proteinpanic.firebaseio.com");

		var proteinArr = $firebaseArray(proteins);
		var userArr = $firebaseArray(users);
		var currentUID = uid.getUid();

		var game = new Phaser.Game(1024, 600, Phaser.AUTO, "gameTarget");
		game.state.start("gameInit");

		var authData = ref.getAuth();
		if(authData === null) {
			game.state.start("loginMenu");
		} else {
		  uid.setUid(authData.uid);
		  currentUID = authData.uid;
		}


		userArr.$loaded().then(angular.bind(this, function(data) {
			for(var key in data) {
				if(data[key].uid === currentUID) {
					this.username = data[key].username;
				}
			}
		}));

		function gameInit() {
			game.state.add("gameInit", {preload: preload});

			function preload() {
				game.load.audio('titletrk', ['audio/titleTrack.wav']);
				game.load.audio('hitReact', ['audio/hitReaction.wav']);
				game.load.audio('ping', ['audio/ping.wav']);
				game.load.audio('success', ['audio/success.wav']);
				game.load.image("background", "images/Cell_bg.png");
				game.load.image("selection_box", "images/selection_box.png");
				game.load.spritesheet("player", "images/Ribosome.png", 65, 70);
				game.load.spritesheet("ALA", "images/Alanine.png", 60, 59);
				game.load.spritesheet("ARG", "images/Arginine.png", 60, 52);
				game.load.spritesheet("ASN", "images/Asparagine.png", 26, 60);
				game.load.spritesheet("ASP", "images/Aspartic_acid.png", 60, 58);
				game.load.spritesheet("CYS", "images/Cysteine.png", 60, 59);
				game.load.spritesheet("GLU", "images/Glutamic_acid.png", 30, 60);
				game.load.spritesheet("GLN", "images/Glutamine.png", 60, 44);
				game.load.spritesheet("GLY", "images/Glycine.png", 60, 57);
				game.load.spritesheet("HIS", "images/Histidine.png", 59, 60);
				game.load.spritesheet("ILE", "images/Isoleucine.png", 60, 59);
				game.load.spritesheet("LEU", "images/Leucine.png", 59, 60);
				game.load.spritesheet("LYS", "images/Lysine.png", 60, 44);
				game.load.spritesheet("MET", "images/Methionine.png", 43, 60);
				game.load.spritesheet("PHE", "images/Phenylalanine.png", 60, 60);
				game.load.spritesheet("PRO", "images/Proline.png", 60, 48);
				game.load.spritesheet("SER", "images/Serine.png", 39, 60);
				game.load.spritesheet("THR", "images/Threonine.png", 56, 60);
				game.load.spritesheet("TRY", "images/Tryptophan.png", 60, 31);
				game.load.spritesheet("TYR", "images/Tyrosine.png", 60, 38);
				game.load.spritesheet("VAL", "images/Valine.png", 60, 60);
			}

		}

		function loginMenu() {
			game.state.add("loginMenu", { preload: preload, create: create, update: update });

			var loginBtn;
			var signupBtn;
			var githubBtn;
			var googleBtn;
			var twitterBtn;
			var facebookBtn;

			function preload() {

			}

			function create(){
		    game.physics.startSystem(Phaser.Physics.ARCADE);

		    game.add.sprite(0, 0, 'menu');
		    button = game.add.button(50, 275, 'start', startClick, this);
		    button.scale.setTo(0.5);

		    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		  }

		  function update() {
		    if (aKey.isDown && enterKey.isDown) {
		      startLvl3();
		    }
		  }

		  function startClick () {
		    this.game.state.start('lvl1');
		  }

		  function startLvl3(){
		    game.state.start('level3');
		  }
		}	
	}]);
});