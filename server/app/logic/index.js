'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

  var playersResources = {};
  var listOfOwnResources = playersResources[player.id];
  var listOfLeftResources = playersResources.leftNeighbor;
  var listOfRightResources = playersResources.rightNeighbor;

  //after a card is selected by player - receive player & card?

  // 1. do i already have the card?
  // 2. do i have an upgrade? (cards)
  // 3. check cost
    // 3.1. is free?
  // 4) how much of it can i buy myself?
  // 4.1 can i buy remainder from neighbors?

  var firstBuild = function() {
    return player.getBoard()
    .then(function(board){
      listOfOwnResources = {};
      listOfOwnResources[board.resource] = 1;
      return Promise.join(player.getLeftNeighbor(), player.getRightNeighbor());
    })
    .spread(function(leftNeighbor, rightNeighbor) {
      return Promise.join(leftNeighbor, rightNeighbor, leftNeighbor.getBoard(), rightNeighbor.getBoard())
    })
    .spread(function(leftNeighbor, rightNeighbor, leftNeighborBoard, rightNeighborBoard) {
      listOfLeftResources = {};
      listOfRightResources = {};
      listOfLeftResources[leftNeighborBoard.resource] = 1;
      listOfRightResources[rightNeighborBoard.resource] = 1;
    })
  }

  var buildResources = function(player, resources) {
    for (var i = 0; i < resources.length; i++) {
      if (!listOfOwnResources[resources[i]]) listOfOwnResources[resources[i]] = 1;
      else listOfOwnResources[resources[i]]++;
    }
  }

  var canIBuyFromMyNeighbors = function(player, cost) {
    var leftResourcesCopy = _.cloneDeep(listOfLeftResources);
    var rightResourcesCopy = _.cloneDeep(listOfRightResources);
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
  // cost = ['wood', 'clay']
  // ownResources = {'wood': 2, 'glass': 5}
  var checkResourcePaymentMethods = function(player, cost) {
    var ownResourcesCopy = _.cloneDeep(listOfOwnResources)
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

  var checkSelectedCard = function(player, card) {
    return player.getPermanent()
    .then(function(builtCards){
      if (!builtCards.length) {
        if (!card.cost) return "free";
        // if card cost is money value
        else if (!!Number(card.cost[0])) {
          if (player.money >= card.cost[0]) return "paid money";
          else return "can't pay money";
        }
      }
      else { 
        for (var i = 0; i < builtCards.length; i++) {
          // for (let i of builtCards) {}
          if (builtCards[i].name === card.name) return "already have it, can't play";
          else if (!card.cost) return "free";
          else if (builtCards[i].upgradeTo.indexOf(card.name)!==-1) return "upgrade";
        }
      }
      return checkPaymentMethods(player, card.cost)
    })
  }

}