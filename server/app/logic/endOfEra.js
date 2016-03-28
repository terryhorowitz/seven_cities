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


var Game = require('../../db/models').Game
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var War = require('./war')
var playCard = require('./play_card')
var Promise = require('bluebird')
var _ = require('lodash')

var eraEnded = function(gameId, currentEra) {

  var newPlayerHand, shuffledDeck;

  return Game.findById(gameId)
  .then(function(game) {
    game.getGamePlayers()
  })
  .then(function(playersArr){
    return Promise.map(playersArr, function(player){
      return player.getTemporary()
      .then(function(playerHand){
        playerHand.forEach(function(card){
          game.addDiscard(card)
          playCard.discard(player, card)
        })
        return Deck.findOne({where: {era: currentEra++, numPlayers: playersArr.length}, include: [{all:true}]})
      })
      .then(function(deck){
        shuffledDeck = _.shuffle(deck.cards)
        newPlayerHand = shuffledDeck.splice(0, 7)
        return Promise.join(player.setTemporary(newPlayerHand), game.setDecks(deck))
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