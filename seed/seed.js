'use strict';

var connectToDb = require('../server/db').db;
var Promise = require('bluebird');

var Card = require('../server/db/models').Card;
var Deck = require('../server/db/models').Deck;
var Board = require('../server/db/models').Board;
var Game = require('../server/db/models').Game;
var Player = require('../server/db/models').Player;
var deckSeed = require('./decks.js');
var boardSeed = require('./boards.js');
var ageICards = require('./age_I_cards.js');
var ageIICards = require('./age_II_cards.js');
var ageIIICards = require('./age_III_cards.js');


var seedCards = function () {
  
  var cards = ageICards.concat(ageIICards).concat(ageIIICards);
  //clear db first to avoid duplicates
  return Card.destroy({where: {era: {$lte: 3}}})
  .then(function(){
    return Card.bulkCreate(cards);
  }).catch(function(err){
    console.error('error seeding cards', err)
  })
  
}

var seedDecks = function(){
  
  return Deck.destroy({where: {era: {$lte: 3}}})
  .then(function(){
    return Promise.map(deckSeed, function(deck){
      return Deck.create(deck)
      .then(function(deck){
        return Promise.join(Card.findAll({
          where: {
            era: deck.era,
            numPlayers: {$lte: deck.numPlayers}
          }
        }), deck);
      })
      .spread(function(cards, deck){
        return deck.setCards(cards)
      })
    })
  }).catch(function(err){
    console.error('error seeding decks', err)
  })
  
}

var seedBoards = function () {
  return Board.destroy({where: {side: 'A'}})
  .then(function(){
    return Board.bulkCreate(boardSeed)
  }).catch(function(err){
    console.error('error seeding boards', err)
  })
}

var seedDeckToGame = function () {
  return Game.destroy({where: {name: "test game"}})
  .then(function(){
    return Game.create({name: "test game"})
  })
  .then(function(game){
    return Promise.join(game, Deck.findOne({where: {era: 1, numPlayers: 3}}))
  })
  .spread(function(game, deck){
    console.log('DECK', deck)
    return game.setDecks(deck)
  })
}

var seedCardsToPlayers = function () {
  return Player.findOne({name: "player1"})
  .then(function(player){
    return Promise.join(Card.findAll(), player)
  })
  .spread(function(cards, player){
    console.log('WHAT?!? ', cards[0], player)
    return player.setTemporary(cards[0])
  })
  .then(function(res){
    console.log("SEETTTTINNNNGGG TEMPPORTARYYYSFDS", res)
  })
}

var game = require("./testgame.js").TestGame
var Player1 = require("./testgame.js").Player1
var Player2 = require("./testgame.js").Player2
var Player3 = require("./testgame.js").Player3
// connectToDb.sync({force:true})
seedCards()
.then(function(){
  return seedDecks();
})
.then(function(){
  return seedBoards();
})
.then(function(){
  return Promise.join(Game.create(game), Player.create(Player1), Player.create(Player2), Player.create(Player3))
})
.spread(function(game, player1, player2, player3){
  return Promise.join(game, game.setPlayers([player1, player2, player3]), player1, player2, player3)
})
.spread(function(game1, game2, player1, player2, player3){
  return Promise.join(game2, player1.update({LeftNeighborId: player3.id, RightNeighborId: player2.id}), player2.update({LeftNeighborId: player1.id, RightNeighborId: player3.id}), player3.update({LeftNeighborId: player2.id, RightNeighborId: player1.id}))
})
.then(function(){
  return seedDeckToGame()
})
.then(function(){
  return seedCardsToPlayers();
})
.then(function(){
  console.log('Database seeded :)')
}).catch(function(err){
    console.error('seed error!', err)
})