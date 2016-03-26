'use strict';

var Game = require('../../db/models').Game;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;

var db_getters = require('./db_getters');
var addToPlayerResources = require('./player_resources');
var playOptions = require('./play_card_options')();
var resourcesObj = require('./game_resources.js')()

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {
  
  
  ////////////// STATE ////////////////
  var player, card;
  var newResources = ["Raw Resource", "Processed Resource", "Forum", "Caravansery"]; 
  var tradingSites = ["Vineyard", "Bazar", "Haven", "Chamber of Commerce", "Lighthouse"];
  var tradePosts = ["East Trading Post", "West Trading Post", "Marketplace"]
  
  var choiceMap = {
    "get free": buildCard,
    "upgrade": buildCard,
    "paid by own resources": buildCard,
    "pay money": payForCard,
    "build wonder": buildWonder,
    "discard": discard
  }
  
  var resourceTypeMap = {
      "wood": 'raw',
      "clay": 'raw',
      "ore": 'raw',
      "stone": 'raw',
      "glass": 'processed',
      "textile": 'processed',
      "papyrus": 'processed'
    }
  
  /////////////////////////////////////
  
  
  /////// Public API/////////////
  function orchestrator(playersSelections){
    //playerId, cardId, choice
    return Promise.map(playersSelections, function(playerChoice){
      var playerId = playerChoice.playerId;
      var cardId = playerChoice.cardId;
      var choice = playerChoice.choice;
      
      return Promise.join(db_getters.getPlayer(playerId), db_getters.getCard(cardId))
      .spread(function(_player, _card){
        player = _player; 
        card = _card; 
        return executeChoice(choice)
      })
      
    })
    .then(function(response){
      console.log('resssss', response)
//      return shiftHand();
    }).catch(function(err){ console.error('whoops', err) })
//    .then(function(){
////      return returnUpdatedGame();
//    })
  }
  
  //////////////
  


  function executeChoice(choice){
    //if choice is not in map, an obj was returned, indicating trade options were selected
    if (!choiceMap[choice]) tradeForCard(choice);
    else choiceMap[choice]();
  }

  
  ////// IN MAP
  function buildCard() {
    return doSomethingBasedOnBuildingACard()
    .then(function(){
      console.log('are we even here though?', card)
      return Promise.join(player.removeTemporary(card), player.addPermanent(card));
    })
  }
  
  function payForCard() {
    var total = player.money - card.cost;
    player.money = total;
    return buildCard();
  }
  
  function buildWonder(){
    return playOptions.checkIfPlayerCanBuildWonder()
    .then(function(response){
      player.wondersBuilt++;
      if (typeof response === 'string'){
        return player.removeTemporary(card); //remove from player but do not include in game discard
      }
      else {
        return tradeForCard(response);
      }
      //need to consider outcome(functionality) of building wonder
    })
  }
  
  function discard(){
    db_getter.getGame(player.gameId)
    .then(function(game){
      return Promise.join(game.addDiscard(discardCard), playerDiscarding.removeTemporary(discardCard));
    })
    .then(function(){
      player.money+=3;
      return player.save();
    })
  }
  
  ///////
  
  function doSomethingBasedOnBuildingACard(){
    if (newResources.indexOf(card.type) > -1 || newResources.indexOf(card.name) > -1){
      return addToPlayerResources.buildPlayerResources(player, card.functionality);
    }

    else if (tradingSites.indexOf(card.name) > -1){
      return getMoneyFromCard();
    }
    else if (tradePosts.indexOf(card.name) > -1){
      //functionality array indicates direction and type of resource
      addToPlayerResources.updateResourceTradingParams(player, card.functionality[0], card.functionality[card.functionality.length - 1]);
    }
    //some cards that do not have immediate effects will also pass through here
    else return increaseMoney(); 
  }
  
  

  function increaseMoney(){
    if (card.name === 'Tavern') player.money += 5;
    else if (card.name === 'Arena') player.money += (player.wondersBuilt * 3);
    return player.save()
  }
  
  
  function getMoneyFromCard(){
    // this is weird because functionality array holds mixed types by design, don't worry about it 
    if (card.functionality[0] === "left"){
      return Promise.join(countNeighborCardsOfType(), countOwnCardsOfType())
      .spread(function(leftAmount, rightAmount){
        player.money += leftAmount + rightAmount;
        return buildCard();
      })
    } 
    // if first element in functionality array is not left, then you only have to update own resources 
    else {
      return countOwnCardsOfType()
      .then(function(amount){
        player.money += amount;
        return buildCard();
      })
    }  
  }
  
  function countNeighborCardsOfType(){
    var cardToBePaidFor = card.functionality[card.functionality.length - 1];
    return db_getters.getNeighbors(player)
    .spread(function(leftNeighbor, rightNeighbor){
      return db_getters.getPermanentForLR({where: {type: cardToBePaidFor}}, leftNeighbor, rightNeighbor)
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
  
  
  function tradeForCard(tradeParams){
    //obj that needs to be recieved: {left: ['wood', 'clay'], right: ['clay]} OR {left: ['ore'], right: null} etc).
    var payLeft = trade(tradeParams.left, 'leftNeighbor');
    var payRight = tradeParams(tradeParams.right, 'rightNeighbor')
    return db_getters.getNeighbors(player)
    .then(function(left, right){
      if (tradeParams.left !== null && tradeParams.right !== null){
        player.money -= payLeft - payRight;
        left.money += payLeft;
        right.money += payRight;
      }
      else if (!tradeParams.right) {
        player.money -= payLeft;
        left.money += payLeft;
      }
      else if (!tradeParams.left) {
        player.money -= payLeft;
        right.money += payLeft;
      }
      return buildCard();
    })
  }

  function trade(trade, tradeDirection){
    var tradeParams = resourcesObj.getGameResources[player.gameId][player.id][tradeDirection].trade;
    var totalPayment = 0;
    for (var i = 0; i < trade.length; i++){
      totalPayment += tradeParams[resourceTypeMap[trade[i]]];
    }
    return totalPayment;
  }
    
  function shiftHand(){
    var newHand;
    return db_getters.getNeighbors(player)
    .spread(function(left, right){
        return db_getters.getTemporaryForLR({}, left, right);
    })
    .then(function(leftHand, rightHand){
      card.era === 2 ? newHand = leftHand : newHand = rightHand;
      return player.setTemporary(newHand);
    })
  }
  
  function returnUpdatedGame () {
    return db_getters.getGame(player.gameId);
  }

  // PUBLIC API: 
  return orchestrator;

}