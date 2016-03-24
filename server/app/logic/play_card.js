'use strict';

var Game = require('../../db/models').Game;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var resourceBuilder = require('./game_resources');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

  var executeChoice = function (playerId, cardId, choice){
    return Promise.join(Player.findOne({where: {id: playerId}}), Card.findOne({where: {id: cardId}}))
    .spread(function(player, card){
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
      if (choice === "discard"){
        discard(player, card);
      }
    })
  }

  var buildCard = function (playerBuildingCard, cardToBuild) {

    return playerBuildingCard.removeTemporary(cardToBuild)//do these save to DB?
    .then(function(player){
      return player.addPermanent(cardToBuild)
    })
    .then(function(player){
//      console.log('card moved to built cards (perm)!', player)
      if (card.type === "Raw Resource" || card.type === "Processed Resource"){
        resourceBuilder.buildPlayerResources(player, card.functionality);
      }
      return player;
    })
  }
  
  var payForCard = function (playerToCharge, cardToBuy) {
    
    var price = cardToBuy.cost;
    return Player.findOne({where: {id: playerToCharge.id}})
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