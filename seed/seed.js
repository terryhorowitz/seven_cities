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
  return Card.destroy({where: {}})
  .then(function(){
    return Card.bulkCreate(cards);
  }).catch(function(err){
    console.error('error seeding cards', err)
  })
  
}

var seedDecks = function(){
  
  return Deck.destroy({where: {}})
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
  return Board.destroy({where: {}})
  .then(function(){
    return Board.bulkCreate(boardSeed)
  }).catch(function(err){
    console.error('error seeding boards', err)
  })
}

seedCards()
.then(function(){
  return seedDecks();
})
.then(function(){
  return seedBoards();
})
.then(function(){
  console.log('Database seeded :)')
}).catch(function(err){
    console.error('seed error!', err)
})