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
    //{neighborR: socketthing, neighborL: sockethign}
		return Promise.map(playersArr, function(player) {
			return Player.create({name: player.name, money: 3, tokens: 0, socket: player.socket})
      .then(function(newPlayer){
        return newPlayer.setBoard(player.board)
      })
		})
	}
module.exports = {
	startGame: startGame
}

// }