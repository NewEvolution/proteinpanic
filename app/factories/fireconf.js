define([
  "angular",
  "firebase"
], function(angular, firebase) {
  angular
  .module("AminoApp.fireconf", [])
  .factory("fireconf", function() {
    firebase.initializeApp({
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: ""
    });
    return firebase;
  });
});
