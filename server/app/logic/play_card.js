'use strict';

var Game = require('../../db/models').Game;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var resourceBuilder = require('./play_card_options')();
var resourcesObj = require('./game_resources.js')()
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
        choicePromise = tradeForCard(player, card, choice); //then buildCard()
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
      if (cardToBuild.type === "Raw Resource" || cardToBuild.type === "Processed Resource" || cardToBuild.name === "Forum" || cardToBuild.name === "Caravansery"){
        resourceBuilder.buildPlayerResources(playerBuildingCard, cardToBuild.functionality);
      }
      
      else if (cardToBuild.name === "Tavern") playerBuildingCard.money+=5;
      else if(cardToBuild.name === "Vineyard" || cardToBuild.name === "Bazar") payForEachCardType(cardToBuild);
      else if (cardToBuild.name === "Haven" || cardToBuild.name === "Chamber of Commerce") //???????
        
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
    var tradePromise;
    if (tradeParams.left !== null && tradeParams.right !== null) tradePromise = Promise.join(tradeLeft(playerTrading, tradeParams.left), tradeRight(playerTrading, tradeParams.right))
    if (tradeParams.left) tradeLeft(playerTrading, tradeParams.left)
    if (tradeParams.right) tradePromise = tradeRight(playerTrading, tradeParams.right)
    
    return tradePromise
    .then(function(){
      buildCard(playerTrading, cardToPayFor)
    })
  }
  
  //there must be a better way...instead of making again for right?
  function tradeLeft(activePlayer, trade){
    var resourceTypeMap = {
      wood: 'raw',
      clay: 'raw',
      ore: 'raw',
      stone: 'raw',
      glass: 'processed',
      textile: 'processed',
      papyrus: 'processed'
    }
    //need to check if player has any trade cards built that change trade conditions
    //need to see if they are trading left, right or both
    //figure out how much to pay each player
//    var playerAndNeighborRsc = gameResources.getGameResources(activePlayer.gameId)[activePlayer];
//    //{self: {}, left: {}, right:{}}
    return Promise.join(activePlayer.getLeftNeighbor(), activePlayer.getPermanent({where: {type: 'Trading'}}))
    .spread(function(leftNeighbor, builtTradeCards){
      //make a function to check player trade options?
      var cost = 0;
      var opts = {raw: 2, processed: 2};
      
      if (builtTradeCards.length){
        for (var i = 0; i < builtTradeCards.length; i++){
          if (builtTradeCards[i].functionality[0] === 'left'){
            if (builtTradeCards[i].functionality[2]) opts.processed = 1;
            if (builtTradeCards[i].functionality[1] === "Raw Resource") opts.raw = 1;
          }
        }
      }
      
      for (var i = 0; i < trade.length; i++){
        cost += opts[resourceTypeMap[trade[i]]];
      }
      activePlayer.money = activePlayer.money - cost;
      leftNeighbor.money = leftNeighbor.money + cost;
      return Promise.join(activePlayer.save(), leftNeighbor.save())
    })
    
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
