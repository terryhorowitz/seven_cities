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
    "Discard": discard
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
    return playersSelections.reduce(function(promiseAccumulator, playerChoice){
      return promiseAccumulator
        .then(function(){
          return Promise.join(db_getters.getPlayer(playerChoice.playerId), db_getters.getCard(playerChoice.cardId))
        })
        .spread(function(_player, _card){
          player = _player;
          card = _card;
          return executeChoice(playerChoice.choice);
        })
    }, Promise.resolve())
    .then(function(){
      //rotate hands
      return shiftHandFromPlayers(playersSelections[0].playerId)
    })
    .then(function(){
      return returnUpdatedGame();
    })
    .catch(function(err){ console.error('error executing', err) })
//    return Promise.map(playersSelections, function(playerChoice){
//      
//      return Promise.join(db_getters.getPlayer(playerChoice.playerId), db_getters.getCard(playerChoice.cardId))
//      .spread(function(_player, _card){
//        console.log('the guy', _player.id)
//        player = _player; 
//        console.log('the guy saved', player.id)
//        console.log('the things', _card.id, playerChoice.choice)
//        card = _card; 
//        return executeChoice(playerChoice.choice)
//      })
//      
//    })
//    .then(function(){
//      return shiftHand();
//    })
//    .then(function(){
////      return returnUpdatedGame();
//    })
  }
  
  //////////////
  


  function executeChoice(choice){
    //if choice is not in map, an obj was returned, indicating trade options were selected
    if (!choiceMap[choice]) return tradeForCard(choice);
    else return choiceMap[choice]();
  }

  
  ////// IN MAP
  function buildCard() {
    return doSomethingBasedOnBuildingACard()
    .then(function(){
      return Promise.join(player.removeTemporary(card), player.addPermanent(card));
    })
    .catch(function(err){
      console.log(err, 'error!');
    });
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
    return db_getters.getGame(player.gameId)
    .then(function(game){
      return Promise.join(game.addDiscard(card), player.removeTemporary(card));
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
      return addToPlayerResources.updateResourceTradingParams(player, card.functionality[0], card.functionality[card.functionality.length - 1]);
    }
    //some cards that do not have immediate effects will also pass through here
    else return increaseMoney(); 
  }
  
  

  function increaseMoney(){
    if (card.name === 'Tavern') player.money += 5;
    else if (card.name === 'Arena') player.money += (player.wondersBuilt * 3);
    else return Promise.resolve();
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
    
  function shiftHandFromPlayers(startPlayerId){
    return db_getters.getPlayer(startPlayerId)
    .then(function(player){
      return db_getters.getGame(player.gameId)
    })
    .then(function(game){
      var playerSwapping = _.find(game.GamePlayers, {id: startPlayerId});
      var lastPass = playerSwapping.Temporary;
      var newTempCards = {};
      while (playerSwapping.RightNeighborId !== startPlayerId){
        newTempCards[playerSwapping.id] = _.find(game.GamePlayers, {id: playerSwapping.RightNeighborId}).Temporary;
        playerSwapping = _.find(game.GamePlayers, {id: playerSwapping.RightNeighborId});
      }
      var lastPlayer = _.find(game.GamePlayers, {RightNeighborId: startPlayerId});
      newTempCards[lastPlayer.id] = lastPass;
      return Promise.map(game.GamePlayers, function(player){
        return player.setTemporary(newTempCards[player.id])
      })
    })
  }
  
  function returnUpdatedGame () {
    return db_getters.getGame(player.gameId);
  }

  // PUBLIC API: 
  return orchestrator;

}