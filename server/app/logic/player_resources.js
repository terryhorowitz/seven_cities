'use strict';
var getGameResources = require('./game_resources')().getGameResources;

function buildPlayerResources(player, resources) {
  var gameResources = getGameResources(player.gameId);
  var playersResources = gameResources[player.id].self;
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
  return player.save();
}

function updateResourceTradingParams(player, direction, resourceType) {
  var gameResources = getGameResources(player.gameId);
  var leftResourcesTradeParams = gameResources[player.id].left.trade;
  var rightResourcesTradeParams = gameResources[player.id].right.trade;
  if (resourceType === "Raw Resource" && direction === 'left'){
    leftResourcesTradeParams.raw = 1;
  } 
  else if (resourceType === "Raw Resource" && direction === 'right'){
    rightResourcesTradeParams.raw = 1;
  }
  else {
    leftResourcesTradeParams.processed = 1;
    rightResourcesTradeParams.processed = 1;
  }
  console.log('does it change things?', gameResources[player.id])
  return player.save();
}

module.exports = {
  buildPlayerResources: buildPlayerResources,
  updateResourceTradingParams: updateResourceTradingParams
};