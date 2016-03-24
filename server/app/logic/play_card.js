'use strict';

var Game = require('../../db/models').Game;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var resourceBuilder = require('./game_resources');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

  function executeChoice(playerId, cardId, choice){
    return Promise.join(Player.findOne({where: {id: playerId}}), Card.findOne({where: {id: cardId}}))
    .spread(function(player, card){
      if (choice === "get free" || choice === "upgrade" || choice === "paid by own resources"){
        return buildCard(player, card)
      }
      if (choice === "pay money"){
        return payForCard(player, card); //then buildCard()
      }
      if (typeof choice === "object"){
        return tradeForCard(player, card, choice); //then buildCard()
      }
      if (choice === "build wonder"){
        return buildWonder(player, card);
      }
      if (choice === "discard"){
        return discard(player, card);
      }
    })
  }

  function buildCard(playerBuildingCard, cardToBuild) {

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
  
  function payForCard(playerToCharge, cardToBuy) {
    var total = player.money - cardToBuy.cost;
    return player.update({money: total})
    .then(function(player){
//      console.log('charged player, building card!', player)
      return buildCard(player, cardToBuy);
    })
  }
  
//  var tradeForCard = function (playerTrading, cardToPayFor, tradeParams){
//    
//    //need tradeParams to be an object containing player(s) we are trading with and what items we are trading with them (e.g. {left: ['wood'], right: ['clay']} OR {left: 2} etc).
//    
//    
//  }
  
  function discard(playerDiscarding, discardCard){
    return Game.findOne({where: {id: playerDiscarding.gameId}})
    .then(function(game){
      return game.addDiscard(discardCard);
    })
    .then(function(){
      return playerDiscarding.removeTemporary(discardCard);
    })
  }

}