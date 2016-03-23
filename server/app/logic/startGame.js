'use strict';

var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

	function startGame (playersArr, roomName) {
		//please make it so all the players in the array are updated in the db to match the array (change hand, board). maybe using promise.map if you want
		//and also create a game and put the players in it and then maybe return the game?
		Promise.map(players, function(player) {
			Player.findOne({where: {id: player.playerId}})
		})
	}


}