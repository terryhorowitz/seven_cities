'use strict';

var connectToDb = require('../server/db').db;
var Promise = require('bluebird');

var Card = require('../server/db/models').Card;
var Deck = require('../server/db/models').Deck;
var Board = require('../server/db/models').Board;
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
  })
  
}

var seedBoards = function () {
  return Board.destroy({where: {side: 'A'}})
  .then(function(){
    return Board.bulkCreate(boardSeed)
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
})