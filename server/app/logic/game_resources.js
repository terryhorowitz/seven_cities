'use strict'
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Card = require('../../db/models').Card
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var db_getters = require('./db_getters'); 
var _ = require('lodash');
var gameResourcesObj = {};

module.exports = function () {
  //rename: game_resource_initalize
  var playersResources, newGame;
  
  function gameResourcesOrchestrator(gameId){
    console.log('gameid', gameId)
    return db_getters.getGame(gameId)
    .then(function(game){
      addGameToResourcesObj(game)
      addPlayersToGameResourcesObj();
      return loadPlayersResources();
    })
    .then(function(){
      return loadTradeParams();
    })
    .then(function(){
      console.log('ame.GamePlayers', newGame.GamePlayers)
      return newGame.GamePlayers
    })
  }
  

  function addGameToResourcesObj (game) {
      newGame = game;
      gameResourcesObj[game.id] = {};
  }
  
  function addPlayersToGameResourcesObj (){
    newGame.GamePlayers.forEach(function(player){
        gameResourcesObj[newGame.id][player.id] = {};
      }); 
    return newGame;
  }
  
  function loadPlayersResources (){
    console.log('here')
    return Promise.each(newGame.GamePlayers, function(player){
        Promise.join(loadOwnResources(player), loadNeighborResources(player))
    })
  }

  function loadOwnResources(player) {
    playersResources = gameResourcesObj[newGame.id][player.id];
    return player.getBoard()
    .then(function(board){
      playersResources.self = {};
      playersResources.self[board.resource] = 1;
    })
  }
  
  function loadNeighborResources(player){
    playersResources = gameResourcesObj[newGame.id][player.id];
    return db_getters.getNeighbors(player)
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

  function loadTradeParams() {
    console.log('still here')
    console.log('loadTradeParams', newGame)
    playersResources = gameResourcesObj[newGame.id][player.id];
    var initalTradeParams = {raw: 2, processed: 2}
    playersResources.leftNeighbor.trade = initalTradeParams;
    playersResources.rightNeighbor.trade = initalTradeParams;
    return;
  }
  
    
  function getGameResources(gameId) {
    return gameResourcesObj[gameId]
  }
  
  return {
    getGameResources: getGameResources,
    orchestrator: gameResourcesOrchestrator
  }
}