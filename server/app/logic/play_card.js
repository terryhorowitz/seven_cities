'use strict';

var Game = require('../../db/models').Game;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var resourceBuilder = require('./game_resources');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {
  //discard is also an option not checked in our options logic
  var executeChoice = function (playerId, card, choice){
    if (choice === "get free" || choice === "upgrade" || choice === "paid by own resources"){
      buildCard(playerId, card)
    }
    if (choice === "pay money"){
      payForCard(playerId, card); //then buildCard()
    }
    if (typeof choice === "object"){
      tradeForCard(playerId, card, choice); //then buildCard()
    }
    if (choice === "build wonder"){
      buildWonder(playerId, card);
    }
    if (choice === "discard"){
      discard(playerId, card);
    }
  }

  var buildCard = function (playerBuildingCardId, cardToBuildId) {

    return Promise.join(Player.findOne({where: {id: playerBuildingCardId}}), Card.findOne({where: {id: cardToBuildId}}))
    .spread(function(player, card){
      return Promise.join(player.removeTemporary(card), card)
    })
    .spread(function(player, card){
      
      return Promise.join(player.addPermanent(card), card)
    })
    .spread(function(player, card){
      console.log('card moved to built cards (perm)!', player)
      if (card.type === "Raw Resource" || card.type === "Processed Resource"){
        resourceBuilder.buildPlayerResources(player, card.functionality);
      }
      return player;
    })
  }
  
  var payForCard = function (playerToChargeId, cardToBuy) {
    
    var price = cardToBuy.cost;
    return Player.findOne({where: {id: playerToChargeId.id}})
    .then(function(player){
      var total = player.money - price;
      return player.update({money: total})
    })
    .then(function(player){
      console.log('charged player, building card!', player)
      return buildCard(player, cardToBuy);
    })
  }
  
//  var tradeForCard = function (playerTrading, cardToPayFor, tradeParams){
//    
//    //need tradeParams to be an object containing player(s) we are trading with and what items we are trading with them (e.g. {left: ['wood'], right: ['clay']} OR {left: 2} etc).
//    
//    
//  }

}