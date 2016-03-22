'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

  var playersResources = {};

  //after a card is selected by player - receive player, card, game?

  // 1. do i already have the card?
  // 2. do i have an upgrade? (cards)
  // 3. check cost
    // 3.1. is free?
  // 4) how much of it can i buy myself?
  // 4.1 can i buy remainder from neighbors?

  var firstBuild = function() {
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
    })
  }

  var buildResources = function(player, resources) {
    for (var i = 0; i < resources.length; i++) {
      if (!playersResources[player.id][resources[i]]) playersResources[player.id][resources[i]] = 1;
      else playersResources[player.id][resources[i]]++;
    }
  }

  var canIBuyFromMyNeighbors = function(player, cost) {
    var leftResources = _.clone(playersResources.leftNeighbor);
    var rightResources = _.clone(playersResources.rightNeighbor);

  }
  // cost = ['wood', 'clay']
  // ownResources = {'wood': 2, 'glass': 5}
  var checkResourcePaymentMethods = function(player, cost) {
    var ownResources = _.clone(playersResources[player.id])
    for (var i = 0; i < cost.length; i++) {
      if (ownResource[cost[i]] && ownResource[cost[i]] > 0) {
        ownResource[cost[i]]--;
        _.pullAt(cost, i)
      }
    }
    if (!cost.length) return 'paid by own resources';
    else if (player.money == 0) return 'cant afford to buy anything';
    else return canIBuyFromMyNeighbors(cost);
    // ['wood']
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