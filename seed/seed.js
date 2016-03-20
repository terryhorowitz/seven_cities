/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/
//
//var mongoose = require('mongoose');
//var Promise = require('bluebird');
//var chalk = require('chalk');
//var connectToDb = require('./server/db');
//var User = Promise.promisifyAll(mongoose.model('User'));
//
//var seedUsers = function () {
//
//    var users = [
//        {
//            email: 'testing@fsa.com',
//            password: 'password'
//        },
//        {
//            email: 'obama@gmail.com',
//            password: 'potus'
//        }
//    ];
//
//    return User.createAsync(users);
//
//};
//
//connectToDb.then(function () {
//    User.findAsync({}).then(function (users) {
//        if (users.length === 0) {
//            return seedUsers();
//        } else {
//            console.log(chalk.magenta('Seems to already be user data, exiting!'));
//            process.kill(0);
//        }
//    }).then(function () {
//        console.log(chalk.green('Seed successful!'));
//        process.kill(0);
//    }).catch(function (err) {
//        console.error(err);
//        process.kill(1);
//    });
//});
var connectToDb = require('../server/db').db;
var Promise = require('bluebird');

var Card = require('../server/db/models').Card;
var Deck = require('../server/db/models').Deck;
var deckSeed = require('./decks.js');
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

seedCards()
.then(function(){
  return seedDecks();
})
.then(function(){
  console.log('Database seeded :)')
})