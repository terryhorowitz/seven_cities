'use strict'
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

var gameResourcesObj = {};

var getPlayersResources = function (gameId, playerId) {
  return gameResourcesObj[gameId]
}

var addGameToResourcesObj = function (newGameId) {
  return Game.findOne({where: {id: newGameId}, include: [{all: true}]})
  .then(function(game){
    gameResourcesObj[game.id] = {};
    game.players.forEach(function(player){
      gameResourcesObj[game.id][player.id] = {};
    });
    console.log(gameResourcesObj)
  })
}

var firstBuild = function(player, gameId) {
  playersResources = gameResourcesObj[gameId][player.id];
  return player.getBoard()
  .then(function(board){
    playersResources[player.id] = {};
    playersResources[player.id][board.resource] = 1;
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
    console.log('IS THIS IT', gameResourcesObj[gameId])
  })
}


module.exports = {
  getPlayersResources: getPlayersResources,
  addGameToResourcesObj: addGameToResourcesObj
};