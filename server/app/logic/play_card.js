'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {
  //discard is also an option not checked in our options logic
  var executeChoice = function (player, card, choice){
    if (choice === "get free" || choice === "upgrade" || choice === "paid by own resources"){
      buildCard(player, card)
    }
    if (choice === "pay money"){
      payForCard(player, card); //then buildCard()
    }
    if (typeof choice === "object"){
      tradeForCard(player, card, choice); //then buildCard()
    }
    if (choice === "build wonder"){
      buildWonder(player, card);
    }
    
  }
}

var buildCard = function (player, cardToBuild) {
  
  
  
}