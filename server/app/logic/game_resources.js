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
  var newGame;
  
  function gameResourcesOrchestrator(gameId){
    return db_getters.getGame(gameId)
    .then(function(game){
      addGameToResourcesObj(game)
      addPlayersToGameResourcesObj();
      return loadPlayersResources();
    })
    .then(function(){
      return db_getters.getGame(gameId);
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
    return Promise.map(newGame.GamePlayers, function(player){
      return loadOwnResources(player);
    })
    .then(function(players){
      return Promise.map(newGame.GamePlayers, function(player){
        return loadNeighborResources(player)
      })
    })
  }
  
  function loadOwnResources(player) {
    var playersResources = gameResourcesObj[newGame.id][player.id];
    return player.getBoard()
    .then(function(board){
      playersResources.self = {};
      playersResources.self[board.resource] = 1;
    })
  }
  
  function loadNeighborResources(player){
    var playersResources = gameResourcesObj[newGame.id][player.id];
    playersResources.left = gameResourcesObj[player.gameId][player.LeftNeighborId].self;
    playersResources.right = gameResourcesObj[player.gameId][player.RightNeighborId].self;
    return loadTradeParams(player);
  }

  function loadTradeParams(player) {
    var playersResources = gameResourcesObj[newGame.id][player.id];
    var initalTradeParamsL = {raw: 2, processed: 2}
    var initalTradeParamsR = {raw: 2, processed: 2}
    playersResources.trade = {};
    playersResources.trade.left = initalTradeParamsL;
    playersResources.trade.right = initalTradeParamsR;
    return Promise.resolve();
  }
  
    
  function getGameResources(gameId) {
    return gameResourcesObj[gameId]
  }
  
  return {
    getGameResources: getGameResources,
    orchestrator: gameResourcesOrchestrator
  }
}