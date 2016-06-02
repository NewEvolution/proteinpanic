define([
  "angular",
], function(angular) {
  angular
  .module("AminoApp.userCreator", [])
  .factory("userCreator", function() {
    return function(sentUid) {
      builtUser = {
        uid: sentUid,
        achievements: {
          epicCollections: 0,
          totalEpicCollections: 0,
          hiddenAminoAcids: 0,
          totalHiddenAminoAcids: 0,
          longWayHomes: 0,
          totalLongWayHomes: 0,
          cleanCollections: 0,
          totalCleanCollections: 0,
          quickCollections: 0,
          totalQuickCollections: 0
        },
        ribosomeMuted: false,
        color: "#000000",
        checkpoint: 10,
        mouse: false,
        intro: true,
        effects: 1,
        music: 1
      };
      return builtUser;
    };
  });
});
