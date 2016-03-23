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

  var buildCard = function (playerToGiveCard, cardToBuild) {

    return Player.findOne({where: {id: playerToGiveCard.id}})
    .then(function(player){
      return player.removeTemporary(cardToBuild)
    })
    .then(function(){
      return player.addPermanent(cardToBuild)
    })
    .then(function(player){
      console.log('card moved to built cards (perm)!', player)
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