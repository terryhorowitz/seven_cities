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
  for (var i = 0; i < warCards.length; i++) {
    totalPoints += warCards[i].functionality.length;
  }
  return totalPoints;
}

var eachPlayerWar = function(player, era) {
  var playerWarPoints = 0;
  var leftNeighborWarPoints = 0;
  var warPoints = getEraAwardPoints(era);
  var newPlayerToken = player.tokens;
  var newNeighborToken;

  return player.getLeftNeighbor()
  .then(function(leftNeighbor) {
    newNeighborToken = leftNeighbor.tokens;
    return Promise.join(player, leftNeighbor, player.getPermanent({where: {type: "War"}}), leftNeighbor.getPermanent({where: {type: "War"}}))
  })
  .spread(function(player, leftNeighbor, playerWarCards, leftNeighborWarCards) {
    console.log('BEFORE newPlayerToken', newPlayerToken)
    console.log('BEFORE newNeighborToken', newNeighborToken)
    if (playerWarCards.length) playerWarPoints = countWarPoints(playerWarCards)
    if (leftNeighborWarCards.length) leftNeighborWarPoints = countWarPoints(leftNeighborWarCards)

    if (playerWarPoints > leftNeighborWarPoints) {
      newPlayerToken.push(playerWarPoints * warPoints)
      newNeighborToken.push(-1)
    }
    else if (leftNeighborWarPoints > playerWarPoints) {
      newNeighborToken.push(leftNeighborWarPoints * warPoints)
      newPlayerToken.push(-1)
    }
    console.log('player id', player.id)
    console.log('newPlayerToken', newPlayerToken)
    console.log('newNeighborToken', newNeighborToken)
    console.log('############player', player )
    return Promise.join(player.update({tokens: newPlayerToken}), leftNeighbor.update({tokens: newNeighborToken}))
  })
  .then(function(data) {
    console.log('!!!!!!!!!!!!! after promise.join', data);
  })
}

var goToWar = function(gameId, era) {
  return Game.findById(gameId)
  .then(function(game){
    return game.getGamePlayers()
  })
  .then(function(playersArr){
    playersArr.reduce(function(promiseAccumulator, player){
      return promiseAccumulator.then(function(){
        return eachPlayerWar(player, era);
      })
    }, Promise.resolve())
  })
}

module.exports = {
  goToWar: goToWar
}
