define([
  "angular",
  "firebase"
], function(angular, firebase) {
  angular
  .module("AminoApp.fireconf", [])
  .factory("fireconf", function() {
    firebase.initializeApp({
      apiKey: "AIzaSyAs7q2YBQCw0TDW0P-DF5DgAXyyV4YqmOI",
      authDomain: "proteinpanic.firebaseapp.com",
      databaseURL: "https://proteinpanic.firebaseio.com",
      storageBucket: "project-1082984889749344373.appspot.com",
    });
    return firebase;
  });
});
