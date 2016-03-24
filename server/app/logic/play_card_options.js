'use strict';
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');
var Resources = require('./game_resources.js')();
module.exports = function (gameId) {//this is possible?

  var playersResources;
  var builtWonders = {};
  var gameResources = Resources.get(gameId);
  
  var addGameToResourcesStorage = function (game) {
    if (gamesStoredResources[game.id]) return 'already stored!'
  }
  //after a card is selected by player - receive player & card?
  // 1. do i already have the card?
  // 2. do i have an upgrade? (cards)
  // 3. check cost
    // 3.1. is free?
  // 4) how much of it can i buy myself?
  // 4.1 can i buy remainder from neighbors?
  
  function buildPlayerResources(player, resources) {
    console.log(gameResourcesObj)
    var gameResources = getGameResources(player.gameId);
    playersResources = gameResources[player.id];
    for (var i = 0; i < resources.length; i++) {
      //ore/wood(combo)-type logic
      if (resources[i].length > 5){//if it is a slash resource
        resources[i] = resources[i].split('/');
        if (!playersResources.combo){
            playersResources.combo = [];
        }
        playersResources.combo.push(resources[i])
      }
      //
      else if (!playersResources[resources[i]]){
        playersResources[resources[i]] = 1;
      } 
      else playersResources[resources[i]]++;
    }
  }
  
  function checkSelectedCardOptions(player, card) {
    return player.getPermanent()
    .then(function(builtCards){
      if (!builtCards.length) {
        if (!card.cost) return "get free";
        // if card cost is money value
        else if (!!Number(card.cost[0])) {
          if (player.money >= card.cost[0]) return "pay money";
          else return "can't afford";
        }
      }
      else { 
        for (var i = 0; i < builtCards.length; i++) {
          // for (let i of builtCards) {}
          if (builtCards[i].name === card.name) return "already have it";
          else if (!card.cost) return "get free";
          else if (builtCards[i].upgradeTo.indexOf(card.name)!==-1) return "upgrade";
        }
      }
      return checkResourcePaymentMethods(player, card.cost)
    })
  }
  
  function checkResourcePaymentMethods(player, cost) {
    playersResources = gameResources[player.id];
    var ownResourcesCopy = _.cloneDeep(playersResources[player.id])
    for (var i = 0; i < cost.length; i++) {
      if (ownResourcesCopy[cost[i]] && ownResourcesCopy[cost[i]] > 0) {
        ownResourcesCopy[cost[i]]--;
        _.pullAt(cost, i)
      }
    }
    if (!cost.length) return 'paid by own resources';
    else if (player.money == 0) return 'cant afford to buy anything';
    else return canIBuyFromMyNeighbors(cost);
  }
  
  function canIBuyFromMyNeighbors(player, cost) {
    playersResources = gameResources[player.id];
    var leftResourcesCopy = _.cloneDeep(playersResources.leftNeighbor);
    var rightResourcesCopy = _.cloneDeep(playersResources.rightNeighbor);
    var trade = {};
    var leftContribution = [];
    var rightContribution = [];
    
    for (var i = 0; i < cost.length; i++){
      if (leftResourcesCopy[cost[i]] && leftResourcesCopy[cost[i]] > 0){
        leftResourcesCopy[cost[i]]--;
        leftContribution.push(cost[i]);
      }
      if (rightResourcesCopy[cost[i]] && rightResourcesCopy[cost[i]] > 0){
        rightResourcesCopy[cost[i]]--;
        rightContribution.push(cost[i]);
      }
    }
    
    if (leftContribution.length === cost.length) trade.left = leftContribution;
    else trade.left = null;
    if (rightContribution.length === cost.length) trade.right = rightContribution;
    else trade.right = null;
    if (trade.right === null && trade.left === null) return 'no trade available!'
    return trade;
  }
  
  function checkIfPlayerCanBuildWonder(player){
    return player.getBoard()
    .then(function(board){
      if (builtWonders === 0) return checkResourcePaymentMethods(player, board.wonder1Cost);
      if (builtWonders === 1) return checkResourcePaymentMethods(player, board.wonder2Cost);
      if (builtWonders === 2) return checkResourcePaymentMethods(player, board.wonder3Cost);
      if (builtWonders === 3) return 'all built';
    })
  }
  
  
  
  
  //////////////////////
  
  
//  var gameResourcesObj = {};
//  var playersResources;

  var getGameResources = function (gameId) {
    return Resources[gameId]
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
    .then(function(players){
      return Game.findOne({where: {id: newGameId}, include: [{all: true}]})
    })
    .then(function(game){
      return game;
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
      return player
    })
  }

  function buildPlayerResources(player, resources) {
    console.log(gameResourcesObj)
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
      //
      else if (!playersResources[resources[i]]){
        playersResources[resources[i]] = 1;
      } 
      else playersResources[resources[i]]++;
    }
  }
  
  return {
    get: getGameResources,
    addGameToResourcesObj: addGameToResourcesObj,
    buildPlayerResources: buildPlayerResources
  }
  
  
  
  
  
  return {
    checkSelectedCardOptions: checkSelectedCardOptions
  }
}