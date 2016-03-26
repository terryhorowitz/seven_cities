'use strict';
var getGameResources = require('./game_resources')().getGameResources;

function buildPlayerResources(player, resources) {

  var gameResources = getGameResources(player.gameId);
    playersResources = gameResources[player.id].self;
    for (var i = 0; i < resources.length; i++) {
      //ore/wood(combo)-type logic
      if (resources[i].indexOf('/') !== -1){//if it is a slash resource
        resources[i] = resources[i].split('/');
        if (!playersResources.combo){
            playersResources.combo = [];
        }
        playersResources.combo.push(resources[i])
      }
      else if (!playersResources[resources[i]]){
        playersResources[resources[i]] = 1;
      } 
      else playersResources[resources[i]]++;
    }
  
    return Promise.resolve(player)
  }

module.exports = buildPlayerResources;