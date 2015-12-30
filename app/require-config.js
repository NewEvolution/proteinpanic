require.config({
  paths: {
    angularFilter: "../lib/bower_components/angular-filter/dist/angular-filter.min",
    angularfire: "../lib/bower_components/angularfire/dist/angularfire.min",
    bootstrap: "../lib/bower_components/bootstrap/dist/js/bootstrap.min",
    angularRoute: "../lib/bower_components/angular-route/angular-route",
    phaser: "../lib/bower_components/phaser/build/phaser.min",
    jquery: "../lib/bower_components/jquery/dist/jquery.min",
    angular: "../lib/bower_components/angular/angular.min",
    firebase: "../lib/bower_components/firebase/firebase",
  },
  shim: {
    "angularfire" : ["angular", "firebase"],
    "firebase": {"exports" : "Firebase"},
    "angular" : {"exports" : "angular"},
    "angularFilter" : ["angular"],
    "angularRoute": ["angular"],
    "bootstrap": ["jquery"]
  },
  priority: [
    "angular"
  ]
});

require([
  "angular",
  "app"
  ], function(angular, app) {
    var $appTarget = angular.element(document.getElementsByTagName("body")[0]);
    angular.element($appTarget).ready(function() {
      angular.bootstrap(document, ["AminoApp"]);
    });
  }
);