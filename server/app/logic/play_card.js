'use strict';

var Game = require('../../db/models').Game;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var resourceBuilder = require('./play_card_options')();
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

  function executeChoice(playerId, cardId, choice){
    return Promise.join(Player.findOne({where: {id: playerId}, include: [{all:true}]}), Card.findOne({where: {id: cardId}, include: [{all:true}]}))
    .spread(function(player, card){
      var choicePromise;
      if (choice === "get free" || choice === "upgrade" || choice === "paid by own resources"){
        choicePromise = buildCard(player, card)
      }
      if (choice === "pay money"){
        choicePromise = payForCard(player, card); //then buildCard()
      }
      if (typeof choice === "object"){//indicates a trade option was selected
        choicePromise =tradeForCard(player, card, choice); //then buildCard()
      }
      if (choice === "build wonder"){
        choicePromise = buildWonder(player, card);
      }
      if (choice === "discard"){
        choicePromise = discard(player, card);
      }
      return choicePromise;
    })
  }

  function buildCard(playerBuildingCard, cardToBuild) {

    return playerBuildingCard.removeTemporary(cardToBuild)//do these save to DB?
    .then(function(){
      return playerBuildingCard.addPermanent(cardToBuild)
    }) 
    .then(function(player){
//      console.log('card moved to built cards (perm)!', player)
      if (cardToBuild.type === "Raw Resource" || cardToBuild.type === "Processed Resource"){
        resourceBuilder.buildPlayerResources(playerBuildingCard, cardToBuild.functionality);
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
  
  function tradeForCard(playerTrading, cardToPayFor, tradeParams){
    //need tradeParams to be an object containing player(s) we are trading with and what items we are trading with them (e.g. {left: ['wood', 'clay'], right: ['clay]} OR {left: ['ore']} etc).
    var raw = ['wood', 'clay', 'ore', 'stone'];
    var processed = ['glass', 'textile', 'papyrus'];
    //need to check if player has any trade cards built that change trade conditions
    //need to see if they are trading left, right or both
    //figure out how much to pay each player
    var tradePromise;
    if (tradeParams.left !== null && tradeParams.right !== null) tradePromise = Promise.join(trade(playerTrading, tradeParams.left), trade(playerTrading, tradeParams.right))
    if (tradeParams.left) trade(playerTrading, tradeParams.left).then(dealWithTrade)
    if (tradeParams.right) tradePromise = trade(playerTrading, tradeParams.right).then(dealWithTrade)
    return tradePromise.then()
  }
  
  function trade(activePlayer, trade){
    //write this
  }
  
  
  function buildWonder(playerBuilding, cardToUse){
    //need to add a built wonders property somewhere (see play_card_options)
  }
  
  function discard(playerDiscarding, discardCard){
    return Game.findOne({where: {id: playerDiscarding.gameId}})
    .then(function(game){
      return game.addDiscard(discardCard);
    })
    .then(function(){
      return playerDiscarding.removeTemporary(discardCard);
    })
  }
  return executeChoice;
}

//executeChoice(13,15,"get free");
