define([
  "angular"
], function(angular) {
  angular
  .module("AminoApp.fireconf", [])
  .factory("fireconf", ["firebase", function(firebase) {
    firebase.initializeApp({
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: ""
    });
    return firebase;
  }]);
});
