'use strict'
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

var gameResourcesObj = {};
var playersResources;

var getGameResources = function (gameId) {
  return gameResourcesObj[gameId]
}

var addGameToResourcesObj = function (newGameId) {
  return Game.findOne({where: {id: newGameId}, include: [{all: true}]})
  .then(function(game){
    gameResourcesObj[game.id] = {};
    game.GamePlayers.forEach(function(player){
      gameResourcesObj[game.id][player.id] = {};
    });
    //need to do first build for each player
    return Promise.each(game.GamePlayers, function(player){
      return firstBuild(player, newGameId)
    })
  })
}

//helper function (do not need to export):
var firstBuild = function(player, gameId) {
  playersResources = gameResourcesObj[gameId][player.id];
  return player.getBoard()
  .then(function(board){
    playersResources.self = {};
    playersResources.self[board.resource] = 1;
    return Promise.join(player.getLeftNeighbor(), player.getRightNeighbor());
  })
  .spread(function(leftNeighbor, rightNeighbor) {
    return Promise.join(leftNeighbor, rightNeighbor, leftNeighbor.getBoard(), rightNeighbor.getBoard())
  })
  .spread(function(leftNeighbor, rightNeighbor, leftNeighborBoard, rightNeighborBoard) {
    playersResources.leftNeighbor = {};
    playersResources.rightNeighbor = {};
    playersResources.leftNeighbor[leftNeighborBoard.resource] = 1;
    playersResources.rightNeighbor[rightNeighborBoard.resource] = 1;
    console.log('the obj', gameResourcesObj[gameId])
  })
}

  function buildPlayerResources(player, resources) {
    var gameResources = getGameResources(gameId);
    playersResources = gameResources[player.id];
    for (var i = 0; i < resources.length; i++) {
      //ore/wood(combo)-type logic
      if (resources[i].length > 5){
        resources[i] = resources[i].split('/');
        if (!playersResources[player.id].combo){
            playersResources[player.id].combo = [];
        }
        playersResources[player.id].combo.push(resources[i])
      }
      //
      else if (!playersResources[player.id][resources[i]]){
        playersResources[player.id][resources[i]] = 1;
      } 
      else playersResources[player.id][resources[i]]++;
    }
}


module.exports = {
  get: getGameResources,
  addGameToResourcesObj: addGameToResourcesObj,
  buildPlayerResources: buildPlayerResources
};