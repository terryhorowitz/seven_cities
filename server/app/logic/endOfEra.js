// get players in game
// =========
// get all players' temp cards
// game.addDiscard(card)
// find deck that has new era
// shuffle deck
// assign random 7 cards to each player's temporary hand
// ========
// assign deck to game
// return game

'use strict';


var Game = require('../../db/models').Game;
var Deck = require('../../db/models').Deck;
var Player = require('../../db/models').Player;
var War = require('./war');
var playCard = require('./play_card');
var db_getters = require('./db_getters'); 
var Promise = require('bluebird');
var _ = require('lodash');

var eraEnded = function(game, currentEra) {
  let newPlayerHand, shuffledDeck;
  let playersArr = game.GamePlayers;
  let era = currentEra + 1;
    return Promise.map(playersArr, function(player){
      return player.getTemporary()
      .then(function(playerHand){
        game.addDiscard(playerHand[0]);
        return player;
      })
    })
    .then(function(playersArr) {
      return Deck.findOne({where: {era: era, numPlayers: playersArr.length}, include: [{all:true}]})
      .then(function(deck) {
        shuffledDeck = _.shuffle(deck.cards)
        return game.setDecks(deck)
      })
      .then(function() {
        return Promise.map(playersArr, function(player){
          newPlayerHand = shuffledDeck.splice(0, 7)
          return player.setTemporary(newPlayerHand)
          .then(function(player) {
            return player;         
          })
        })
      .then(function(playersArr) {
        return db_getters.getGame(game.id);
      })
    })
  })
  .catch(function(err){
    console.log('error moving to new era', err)
  })

  //   Deck.findOne({where: {era: currentEra++, numPlayers: playersArr.length}, include: [{all:true}]})
  // })
  // .then(function(deck){
  //   return game.setDecks(deck)
  // })

  // War.goToWar(game, currentEra)
  // .then(function(){

  // })
}

module.exports = {
  eraEnded: eraEnded
}