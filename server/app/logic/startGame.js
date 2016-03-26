'use strict';
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var gameResources = require('./game_resources.js')();
var Promise = require('bluebird');
var _ = require('lodash');
// module.exports = function () {
    var startGame = function (playersArr, roomName) {
        //please make it so all the players in the array are updated in the db to match the array (change hand, board). maybe using promise.map if you want
        //and also create a game and put the players in it and then maybe return the game?
    //{neighborR: socketthing, neighborL: sockething}
        return Promise.map(playersArr, function(player) {
            return Player.create({name: player.name, money: 3, tokens: [], socket: player.socket, wondersBuilt: 0})
            .then(function(newPlayer){
              return newPlayer.setBoard(player.board)
            })
            .then(function(newPlayer){
              return Promise.join(newPlayer, Player.findOne({where: {socket: player.neighborL}}), Player.findOne({where: {socket: player.neighborR}}))
            })
            .spread(function(newPlayer, leftNeighbor, rightNeighbor){
              return Promise.join(newPlayer, newPlayer.setLeftNeighbor(leftNeighbor), newPlayer.setRightNeighbor(rightNeighbor), newPlayer.setTemporary(player.hand))
            })
            .spread(function(newPlayer){
              return newPlayer;
            })
        })
      .then(function(dbPlayers){
        return Promise.join(Game.create({name: roomName}), Deck.findOne({where: {era: 1, numPlayers: playersArr.length}, include: [{all:true}]}), dbPlayers)
      })
      .spread(function(newGame, deck, dbPlayers){
        return Promise.join(newGame, newGame.setGamePlayers(dbPlayers), newGame.setDecks(deck))
      })
      .spread(function(completeGame){
        return gameResources.orchestrator(completeGame.id);  
      })
      .catch(function(err){
        console.log('error making game on DB', err);
      })
    }
    
module.exports = {
    startGame: startGame
}
// }