define([
  "angular",
], function(angular) {
  angular
  .module("AminoApp.revival", [])
  .factory("revival", ["$q", function($q) {
    return function(targetedGroup, neededSprite, spriteX, spriteY, intenseDebug) {
      var deferred = $q.defer();
      var ableToRevive = false;
      targetedGroup.forEachDead(function(deadSprite) {
        if(deadSprite.key === neededSprite && deadSprite.alive === false && !ableToRevive) {
          deadSprite.reset(spriteX, spriteY); // revive an existing dead amino if we have one that matches
          ableToRevive = true;
          if(intenseDebug) {console.log("revived " + deadSprite.key + " at " + spriteX + "x" + spriteY + " in " + targetedGroup.name);}
          deferred.resolve(deadSprite);
        }
      });
      if(!ableToRevive) {
        var spawnedSprite = targetedGroup.create(spriteX, spriteY, neededSprite);
        if(intenseDebug) {console.log("spawned " + spawnedSprite.key + " at " + spriteX + "x" + spriteY + " in " + targetedGroup.name);}
        deferred.resolve(spawnedSprite);
      }
      return deferred.promise;
    };
  }]);
});