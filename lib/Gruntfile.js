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
            jquery: "../lib/bower_components/jquery/dist/jquery.min",
            angular: "../lib/bower_components/angular/angular.min",
            firebase: "../lib/bower_components/firebase/firebase",
          },
          shim: {
            "angular" : {"exports" : "angular"},
            "angular-route": ["angular"],
            "angular-filter": ["angular"],
            "bootstrap": ["jquery"],
            "angularfire": ["angular", "firebase"],
            "firebase": {
                exports: "Firebase"
            }
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
      files: ["../app/**/*.js"],
      options: {
        esnext: true
      }
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
        tasks: ["jshint"]
      },
      sassy: {
        files: ["../sass/**/*.scss"],
        tasks: ["sass"]
      }
    }
  });
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  grunt.registerTask("default", ["newer:imagemin", "newer:plato", "newer:jshint", "newer:sass", "watch"]);
};
