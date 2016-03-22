'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player

module.exports = function () {

  var playersResources = {};

  //after a card is selected by player - receive player, card, game?

  // 1. do i already have the card?
  // 2. do i have an upgrade? (cards)
  // 3. check cost
    // 3.1. is free?
    // 3.2 can i acquire it myself? (board, cards)
  // 4. can i buy from neighbor?

  var buildResources = function(player, resources) {
    if (!playersResources[player.id]) playersResources[player.id] = {};
    for (var i = 0; i < resources.length; i++) {
      if (!playersResources[player.id][resources[i]]) playersResources[player.id][resources[i]] = 1;
      else playersResources[player.id][resources[i]]++;
    }
  }

  var checkSelectedCard = function(player, card) {
    Player.findOne({id : player.id})
    .then(function(player){
      return player.getPermanent()
    })
    .then(function(builtCards){
      for (var i = 0; i < builtCards.length; i++) {
        if (builtCards[i].name === card.name) return "not allowed";
        else if (!card.cost) return "free";
        else if (builtCards[i].upgradeTo.indexOf(card.name)!==-1) return "upgrade";
        else return null
      }
    })
  }

}