'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

// module.exports = function () {


	var startGame = function (playersArr, roomName) {
		//please make it so all the players in the array are updated in the db to match the array (change hand, board). maybe using promise.map if you want
		//and also create a game and put the players in it and then maybe return the game?
    //{neighborR: socketthing, neighborL: sockething}
		return Promise.map(playersArr, function(player) {
			return Player.create({name: player.name, money: 3, tokens: 0, socket: player.socket})
      .then(function(newPlayer){
        return newPlayer.setBoard(player.board)
      })
      .then(function(newPlayer){
        return Promise.join(newPlayer, Player.find({where: {socket: player.neighborL}}), Player.find({where: {socket: player.neighborR}}))
      })
      .spread(function(newPlayer, leftNeighbor, rightNeighbor){
        return Promise.join(newPlayer, newPlayer.setLeftNeighbor(leftNeighbor), newPlayer.setRightNeighbor(rightNeighbor))
      })
      .spread(function(newPlayer){
        return newPlayer;
      })
		})
    .then(function(dbPlayers){
      return Promise.join(Game.create({name: roomName}), dbPlayers)
    })
    .spread(function(newGame, dbPlayers){
      return newGame.setPlayers(dbPlayers)
    })
    .then(function(updatedGame){
      return Promise.join(updatedGame, Deck.find({where: {era: 1, numPlayers: playersArr.length}, include: [{all:true}]}))
    })
    .spread(function(updatedGame, gameDeck){
      console.log('game!!!!!!!!!!!', updatedGame[0][0], 'deck!!!!!!!!', gameDeck)
      console.log(typeof updatedGame[0][0].setDeck)
      // return updatedGame[0][0].setDeck(gameDeck);
    })
    .then(function(gameWithDeck){
      console.log('GAME CREATEDDDDDDDD', gameWithDeck)
    })
	}

module.exports = {
	startGame: startGame
}

// }