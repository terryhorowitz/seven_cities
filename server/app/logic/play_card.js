'use strict';

var Game = require('../../db/models').Game;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;

var db_getters = require('./db_getters');
var addToPlayerResources = require('./player_resources');
var playOptions = require('./play_card_options')();
var resourcesObj = require('./game_resources.js')();
var war = require('./war.js');

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {
  
  
  ////////////// STATE ////////////////
  var player, card, choice;
  var newResources = ["Raw Resource", "Processed Resource", "Forum", "Caravansery"]; 
  var tradingSites = ["Vineyard", "Bazar", "Haven", "Chamber of Commerce", "Lighthouse"];
  var tradePosts = ["East Trading Post", "West Trading Post", "Marketplace"]
  
  var choiceMap = {
    "Build for free": buildCard,
    "Upgrade for free": buildCard,
    "paid by own resources": buildCard,
    "Pay 1 coin": payForCard,
    "Build Wonder": buildWonder,
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
      choice = playerChoice.choice;
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
      return shiftHandFromPlayers(playersSelections[0].playerId, card.dataValues.era)
    })
    .catch(function(err){ console.error('error executing', err) })
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
    player.money = player.money - 1;
    return buildCard();
  }
  
  function buildWonder(){
    player.wondersBuilt = player.wondersBuilt + 1;
      return Promise.join(player.removeTemporary(card), player.save())
      .spread(function(tempRm, _player){
        player = _player;
        return getWonderOutcome();
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
    if (tradingSites.indexOf(card.name) > -1){
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
      .spread(function(neighAmount, ownAmount){
        player.money = player.money + neighAmount + ownAmount;
        return player.save();
      })
    } 
    // if first element in functionality array is not left, then you only have to update own resources 
    else {
      return countOwnCardsOfType()
      .then(function(amount){
        player.money = player.money + amount;
        return player.save();
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
    var forWonder, payLeft, payRight;
    tradeParams.wonder ? forWonder = true : forWonder = false;
    tradeParams.left !== null ? payLeft = trade(tradeParams.left, 'left') : payLeft = 0;
    tradeParams.right !== null ? payRight = trade(tradeParams.right, 'right') : payRight = 0;
    return db_getters.getNeighbors(player)
    .spread(function(leftNeighbor, rightNeighbor){
      player.money = player.money - payLeft - payRight;
      leftNeighbor.money += payLeft;
      rightNeighbor.money += payRight;
      return Promise.join(leftNeighbor.save(), rightNeighbor.save(), player.save())
    })
    .then(function(leftNeighbor, rightNeighbor){
      if (forWonder) return buildWonder();
      else return buildCard();
    })
  }

  function trade (trade, tradeDirection){
    var tradeParams = resourcesObj.getGameResources(player.gameId)[player.id].trade[tradeDirection];
    var totalPayment = 0;
    for (var i = 0; i < trade.length; i++){
      totalPayment += tradeParams[resourceTypeMap[trade[i]]];
    }
    return Number(totalPayment);
  }
  
  function getWonderOutcome () {
    var boardName = player.board.name;
    if (boardName === "Ephesos" && player.wondersBuilt === 2){
      player.money = Number(player.money) + 9;
      return player.update({money: player.money});
    }
    else if (boardName === "Alexandria" && player.wondersBuilt === 2){
      return addToPlayerResources.buildPlayerResources(player, ["clay/ore/wood/stone"]);
    }
    else return Promise.resolve();
  }
    
  function shiftHandFromPlayers(startPlayerId, era){
    var startPlayer;
    var warResults;
    return db_getters.getPlayer(startPlayerId)
    .then(function(_startPlayer){
      startPlayer = _startPlayer;
      return db_getters.getGame(_startPlayer.gameId);
    })
    .then(function(game){
      var playerSwapping = _.find(game.GamePlayers, {id: startPlayerId});
      var lastPass = playerSwapping.Temporary;
      var newTempCards = {};
      var swapNeighbor = (era === 2) ? 'LeftNeighborId' : 'RightNeighborId';

      while (playerSwapping[swapNeighbor] !== startPlayerId){
        newTempCards[playerSwapping.id] = _.find(game.GamePlayers, {id: playerSwapping[swapNeighbor]}).Temporary;
        playerSwapping = _.find(game.GamePlayers, {id: playerSwapping[swapNeighbor]});
      }
      if (newTempCards[startPlayerId].length === 1) { //change this if developing
        return war.goToWar(game, era)
        .then(function(resultsAndEra) {
          warResults = resultsAndEra;
        })

      } else {
        var lastPlayer = _.find(game.GamePlayers, function(eachPlayer) {
          return eachPlayer[swapNeighbor] === startPlayerId;
        });
        
        newTempCards[lastPlayer.id] = lastPass;
        return Promise.map(game.GamePlayers, function(p){
          return p.setTemporary(newTempCards[p.id]);
        })
      }
    })
    .then(function(){
      if (warResults) {
        return Promise.join(db_getters.getGame(startPlayer.gameId), warResults)
      }
      else return db_getters.getGame(startPlayer.gameId)
    })
  }

  // PUBLIC API: 
  return orchestrator;

}
