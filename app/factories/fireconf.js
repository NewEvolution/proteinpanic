define([
  "angular",
  "firebase"
], function(angular, firebase) {
  angular
  .module("AminoApp.fireconf", ["firebase"])
  .factory("fireconf", function(firebase) {
    firebase.initializeApp({
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: ""
    });
    return firebase;
  });
});
