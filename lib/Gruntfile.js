module.exports = function(grunt) {

  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          out: "../built.js",
          baseUrl: "../app/",
          name: "require-config",
          findNestedDependencies: true,
          paths: {
            angularFilter: "../lib/bower_components/angular-filter/dist/angular-filter.min",
            angularfire: "../lib/bower_components/angularfire/dist/angularfire.min",
            bootstrap: "../lib/bower_components/bootstrap/dist/js/bootstrap.min",
            angularRoute: "../lib/bower_components/angular-route/angular-route",
            // phaser: "../lib/bower_components/phaser/build/phaser.min", // ideal, using CDN for production outage resolution
            phaser: "https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.4/phaser.min",
            jquery: "../lib/bower_components/jquery/dist/jquery.min",
            angular: "../lib/bower_components/angular/angular.min",
            firebase: "../lib/bower_components/firebase/firebase",
          },
          shim: {
            "angularfire" : ["angular", "firebase"],
            "firebase": {"exports" : "Firebase"},
            "angular" : {"exports" : "angular"},
            "phaser": {"exports" : "Phaser"},
            "angularFilter" : ["angular"],
            "angularRoute": ["angular"],
            "bootstrap": ["jquery"],
          }
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: "../dev-images/",
          src: ["**/*.{png,jpg,gif}"],
          dest: "../images/"
        }]
      }
    },
    plato: {
      your_task: {
        files: {
          "../report": ["../app/**/*.js"]
        }
      }
    },
    jshint: {
      files: ["../app/**/*.js"]
    },
    sass: {
      dist: {
        files: {
          "../styles/main.css": "../sass/main.scss"
        }
      }
    },
    watch: {
      javascripts: {
        files: ["../app/**/*.js"],
        tasks: ["newer:jshint"]
      },
      sassy: {
        files: ["../sass/**/*.scss"],
        tasks: ["newer:sass"]
      },
      images: {
        files: ["../dev-images/**/*.{png,jpg,gif}"],
        tasks: ["newer:imagemin"]
      }
    }
  });
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  grunt.registerTask("default", ["newer:imagemin", "newer:plato", "newer:jshint", "newer:sass", "watch"]);
};
