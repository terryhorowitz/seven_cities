'use strict'
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Card = require('../../db/models').Card
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');
var gameResourcesObj = {};

module.exports = function () {
  //rename: game_resource_initalize
  var playersResources, newGame;
  
  function gameResourcesOrchestrator(newGameId){
    return getGame(newGameId)
    .then(function(){
      addGameToResourcesObj();
      addPlayersToGameResourcesObj();
      return loadPlayersResources();
    })
    .then(function(){
      return game.GamePlayers
    })
  }
  
  function getGame (gameId){
    return Game.findOne({where: {id: newGameId}, include: [{all: true}]})
  }

  function addGameToResourcesObj () {
      newGame = game;
      gameResourcesObj[game.id] = {};
  }
  
  function addPlayersToGameResourcesObj (){
    newGame.GamePlayers.forEach(function(player){
        gameResourcesObj[game.id][player.id] = {};
      }); 
  }
  
  function loadPlayersResources (){
    return Promise.each(game.GamePlayers, function(player){
        Promise.join(loadOwnResources(player), loadNeighborResources(player))
    })
  }

  function loadOwnResources(player) {
    playersResources = gameResourcesObj[game.id][player.id];
    return player.getBoard()
    .then(function(board){
      playersResources.self = {};
      playersResources.self[board.resource] = 1;
    })
  }
  
  function loadNeighborResources(player){
    return Promise.join(player.getLeftNeighbor(), player.getRightNeighbor())
    .spread(function(leftNeighbor, rightNeighbor) {
      return Promise.join(leftNeighbor, rightNeighbor, leftNeighbor.getBoard(), rightNeighbor.getBoard())
    })
    .spread(function(leftNeighbor, rightNeighbor, leftNeighborBoard, rightNeighborBoard) {
      playersResources.leftNeighbor = {};
      playersResources.rightNeighbor = {};
      playersResources.leftNeighbor[leftNeighborBoard.resource] = 1;
      playersResources.rightNeighbor[rightNeighborBoard.resource] = 1;
    })
  }

//  function buildPlayerResources(player, resources) {
//
//    var gameResources = getGameResources(player.gameId);
//    playersResources = gameResources[player.id].self;
//    for (var i = 0; i < resources.length; i++) {
//      //ore/wood(combo)-type logic
//      if (resources[i].indexOf('/') !== -1){//if it is a slash resource
//        resources[i] = resources[i].split('/');
//        if (!playersResources.combo){
//            playersResources.combo = [];
//        }
//        playersResources.combo.push(resources[i])
//      }
//      //
//      else if (!playersResources[resources[i]]){
//        playersResources[resources[i]] = 1;
//      } 
//      else playersResources[resources[i]]++;
//    }
//  }
  
  function getGameResources(gameId) {
    return gameResourcesObj[gameId]
  }
  
  return {
    getGameResources: getGameResources,
    orchestrator: gameResourcesOrchestrator
  }
}