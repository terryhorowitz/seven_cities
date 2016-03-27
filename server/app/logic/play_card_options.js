'use strict';
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Card = require('../../db/models').Card
var Promise = require('bluebird');
var _ = require('lodash');
var db_getters = require('./db_getters.js');
var Resources = require('./game_resources.js')();

module.exports = function () {

  function checkSelectedCardOptions(playerId, cardId) {
    var player;
    return db_getters.getPlayer(playerId)
    .then(function(_player){
      player = _player;
      return Promise.join(player.getPermanent(), db_getters.getCard(cardId))
    })
    .spread(function(builtCards, card){
      if (!builtCards.length) {
        if (!card.cost) return "get free";
        else if (!!Number(card.cost[0])) {
          if (player.money >= card.cost[0]) return "pay money";
          else return "can't afford";
        }
      }
      else { 
        for (var i = 0; i < builtCards.length; i++) {
          if (builtCards[i].name === card.name) return "already have it";
          else if (!card.cost) return "get free";
          else if (!!Number(card.cost[0])) {
            if (player.money >= card.cost[0]) return "pay money";
            else return "can't afford";
          }
          else if (builtCards[i].upgradeTo) {
            if (builtCards[i].upgradeTo.indexOf(card.name)!==-1) return "upgrade";
          }
        }
      }
      return checkResourcePaymentMethods(player, card.cost)
    })
  }
  
  function checkResourcePaymentMethods(player, cost) {
    var playersResources = Resources.getGameResources(player.gameId)[player.id];
    var ownResourcesCopy = _.cloneDeep(playersResources.self);
//    var counter = 0;
    for (var i = 0; i < cost.length; i++) {
      if (!!ownResourcesCopy[cost[i]] && ownResourcesCopy[cost[i]] > 0) {
        ownResourcesCopy[cost[i]]--;
        _.pullAt(cost, i)
      }
//      while (counter < cost.length){
//        if (!ownResourcesCopy[cost[counter]]) counter++;
//        else {
//          ownResourcesCopy[cost[counter]]--;
//          _.pullAt(cost, counter)
//          counter++;
//        }
      }
    if (!cost.length) return 'paid by own resources';
    else return canIBuyFromMyNeighbors(player, cost);
  }
  
  function canIBuyFromMyNeighbors(player, cost) {
    var playersResources = Resources.getGameResources(player.gameId)[player.id];
    var leftResourcesCopy = _.cloneDeep(playersResources.left);
    var rightResourcesCopy = _.cloneDeep(playersResources.right);
    var trade = {};
    var leftContribution = [];
    var rightContribution = [];
//    var counter = 0;
    
    for (var i = 0; i < cost.length; i++){
//      if (!leftResourcesCopy[cost[i]]){
//        leftContribution = leftContribution;
//      }
//      if (!rightResourcesCopy[cost[i]]){
//        rightContribution = rightContribution;
//      }
      if (leftResourcesCopy[cost[i]] && leftResourcesCopy[cost[i]] > 0){
        leftResourcesCopy[cost[i]]--;
        leftContribution.push(cost[i]);
      }
      if (rightResourcesCopy[cost[i]] && rightResourcesCopy[cost[i]] > 0){
        rightResourcesCopy[cost[i]]--;
        rightContribution.push(cost[i]);
      }
//      while (counter < cost.length){
//        if (!leftResourcesCopy[cost[counter]] && !rightResourcesCopy[cost[counter]]) counter++;
//        else if (leftResourcesCopy[cost[counter]] && leftResourcesCopy[cost[counter]] > 0) {
//          leftResourcesCopy[cost[counter]]--;
//          leftContribution.push(cost[counter]);
//          counter++;
//        }
//        else if (rightResourcesCopy[cost[counter]] && rightResourcesCopy[cost[counter]] > 0){
//          rightResourcesCopy[cost[counter]]--;
//          rightContribution.push(cost[counter]);
//          counter++;
//        }
//      }
    }
    //check if a player can AFFORD!!!!
    if (leftContribution.length === cost.length) trade.left = leftContribution;
    else trade.left = null;
    if (rightContribution.length === cost.length) trade.right = rightContribution;
    else trade.right = null;
    if (trade.right === null && trade.left === null) return 'no trade available!'
    return trade;
  }
  
  function checkIfPlayerCanBuildWonder(playerId){
    return Player.findOne({id: playerId})
    .then(function(player){
      if (player.wondersBuilt === 0) return checkResourcePaymentMethods(player, board.wonder1Cost);
      if (player.wondersBuilt === 1) return checkResourcePaymentMethods(player, board.wonder2Cost);
      if (player.wondersBuilt === 2) return checkResourcePaymentMethods(player, board.wonder3Cost);
      if (player.wondersBuilt === 3) return 'all built';
    })
  }
  
  return {
    checkSelectedCardOptions: checkSelectedCardOptions,
    checkIfPlayerCanBuildWonder: checkIfPlayerCanBuildWonder
  }
}