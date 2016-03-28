// go into each player in game's permanent cards and see if any are of type war
// collect how many times you see the word war
// every player goes to war with ONLY LEFT neighbor (prevent duplicates)
// compare number of war points
// first era win 1 point
// second win 3
// third win 5
// always lose 1
// add points to player.tokens array

'use strict';

var Game = require('../../db/models').Game
var Player = require('../../db/models').Player
var Promise = require('bluebird');

var getEraAwardPoints = function(era) {
  if (era===1) {
    return 1;
  }
  else if (era===2) {
    return 3;
  }
  else if (era===3) {
    return 5;
  }
}

var countWarPoints = function(warCards) {
  var totalPoints = 0;
  for (var i = 0; i < playerCards.length; i++) {
    totalPoints += playerBuiltCards[i].functionality.length;
  }
  return totalPoints;
}

var eachPlayerWar = function(player, era) {

  var playerWarPoints = 0;
  var neighborWarPoints = 0;
  var warPoints = getEraAwardPoints(era)

  return player.getLeftNeighbor()
  .then(function(leftNeighbor) {
      // console.log('?????????? this is player', player);
      // console.log('?????????? this is leftNeighbor', leftNeighbor);

    return Promise.join(player, leftNeighbor, player.getPermanent({where: {type: "War"}}), leftNeighbor.getPermanent({where: {type: "War"}}))
  })
  .spread(function(player, leftNeigbor, playerWarCards, leftNeighborWarCards) {
    if (playerWarCards.length) playerWarPoints = countWarPoints(playerWarCards)
    if (leftNeighborWarCards.length) neighborWarPoints = countWarPoints(leftNeighborWarCards)
      console.log('!!!!!!!!!!!!!   playerWarPoints', playerWarPoints);
      console.log('!!!!!!!!!!!!!   leftNeighborWarPoints', leftNeighborWarPoints);

    if (playerWarPoints > neighborWarPoints) {
      player.tokens.push(playerWarPoints)
      leftNeighbor.tokens.push(-1)
    }
    else if (neighborWarPoints > playerWarPoints) {
      leftNeighbor.tokens.push(neighborWarPoints)
      player.tokens.push(-1)
    }
    return Promise.join(player.save(), leftNeighbor.save())
  })
}

var goToWar = function(gameId, era) {
  console.log('!!!!!!!!!!!!!   inside war');
  return Game.findById(gameId)
  .then(function(game){
    return game.getGamePlayers()
  })
  .then(function(playersArr){
    return Promise.map(playersArr, function(player){
      return eachPlayerWar(player, era)
    })
  })
}

module.exports = {
  goToWar: goToWar
}
