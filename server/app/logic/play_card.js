'use strict';

var Game = require('../../db/models').Game;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var db_getter = require('./db_getter');

var buildPlayerResources = require('./player_resources');
var resourcesObj = require('./game_resources.js')()
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {
  
  
  ////////////// STATE ////////////////
  var player, card;
  var newResources = ["Raw Resource", "Processed Resource", "Forum", "Caravansery"]; 
  var tradingSites = ["Vineyard", "Bazar", "Haven", "Chamber of Commerce", "Lighthouse"];
  
  
  var choiceMap = {
    "get free": buildCard,
    "upgrade": buildCard,
    "paid by own resources": buildCard,
    "pay money": payForCard,
    "build wonder": buildWonder,
    "discard": discard
  }
  
  /////////////////////////////////////
  
  
  /////// Public API
  function orchestrator(playerId, gameId, choice){
    Promise.join(db_getters.getPlayer(playerId), db_getter.getCard(gameId))
    .spread(function(_player, _card){
      player = _player; 
      card = _card; 
      
      return executeChoice(choice)
    }) 
  }
  
  ///////
  


  function executeChoice(choice){
    if (!choiceMap[choice]) tradeForCard(player, card, choice);
    else choiceMap[choice]();
  }

  
  ////// IN MAP
  function buildCard() {
    doSomethingBasedOnBuildingACard()
    return Promise.join(player.removeTemporary(card), player.addPermanent(card))
  }
  
  function payForCard() {
    var total = player.money - card.cost;
    return player.update({money: total});
  }
  
  function buildWonder(playerBuilding, cardToUse){
    //need to add a built wonders property somewhere (see play_card_options)
  }
  
  function discard(){
    db_getter.getGame(player.gameId)
    .then(function(game){
      return Promise.join(game.addDiscard(discardCard), playerDiscarding.removeTemporary(discardCard));
    })
  }
  
  ///////
  
  function doSomethingBasedOnBuildingACard(){
    if (newResources.indexOf(card.type) > -1 || newResources.indexOf(card.name) > -1){
      return buildPlayerResources(player, card.functionality);
    }

    else if (tradingSites.indexOf(card.name) > -1){
      return getMoneyFrom(cardToBuild, playerBuildingCard);
    }
    else return increaseMoney(); 
  }
  
  

  function increaseMoney(){
    if (card.name === 'Tavern') player.money += 5;
    else if (card.name === 'Arena') player.money += (player.wondersBuilt * 3)
    return player.save()
  }
  
  
  function getMoneyFrom(){
    // this is weird because functionality array holds mixed types by design, don't worry about it 
    if (card.functionality[0] === "left"){
      return Promise.join(countNeighborCardsOfType(), countOwnCardsOfType());//.then do money things
    } 
    // if first element in functionality array is not left, then you only have to update own resources 
    else {
      return countOwnCardsOfType();
    }  
  }
  
  function countNeighborCardsOfType(){
    var cardToBePaidFor = card.functionality[card.functionality.length - 1];
    
    return db_getter.getNeighbors(player)
    .spread(function(leftNeighbor, rightNeighbor){
      return db_getter.getPermanentFor({where: {type: cardToBePaidFor}}, leftNeighbor, rightNeighbor)
    })
    .spread(function(leftCards, rightCards){
      return leftCards.length + rightCards.length;
    })
  }
  
  function countOwnCardsOfType(){
    var cardToBePaidFor = card.functionality[card.functionality.length - 1];
    
    return player.getPermanent({where: {type: cardToBePaidFor}})
    .then(function(cards){
      return cards.length;
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
  
  



  // PUBLIC API: 
  return orchestrator;

}

//executeChoice(13,15,"get free");
