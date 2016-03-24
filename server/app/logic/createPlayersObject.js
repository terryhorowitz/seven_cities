'use strict';

var Game = require('../../db/models').Game;
var Player = require('../../db/models').Player;
var Deck = require('../../db/models').Deck;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;

var createPlayersObject = function (allBoards, counter, allSockets, allPlayers) {
	var players = [];
  for (var i = 0; i < counter; i++) {
		var obj = {};
		obj.board = allBoards[i];
		obj.money = 3;
		obj.tokens = 0;
		obj.built = [];
		obj.socket = allSockets[i];
		obj.name = allPlayers[obj.socket][0];
		players.push(obj);
	}
	for (var x = 0; x < players.length; x++) {
		if (players[x + 1]) {
			players[x].neighborR = players[x + 1].socket;
		} else {
			players[x].neighborR = players[0].socket;
		}
		if (players[x - 1]) {
			players[x].neighborL = players[x - 1].socket;
		} else {
			players[x].neighborL = players[players.length - 1].socket;
		}
	}
	return players;
};

var createPlayersObjectRefresh = function(GamePlayers, players) {
	for (var m = 0; m < GamePlayers.length; m++) {
		var obj = {};
		obj.board = GamePlayers[m].board;
		obj.money = GamePlayers[m].money;
		obj.tokens = GamePlayers[m].tokens;
		obj.built = [];
		obj.playerId = GamePlayers[m].id;
		obj.socket = GamePlayers[m].socket;
		obj.name = GamePlayers[m].name;
		obj.neighborL = GamePlayers[m].LeftNeighbor.socket;
		obj.neighborR = GamePlayers[m].RightNeighbor.socket;
		players.push(obj);
	}
	return players;
};
    
module.exports = {
    createPlayersObject: createPlayersObject,
    createPlayersObjectRefresh: createPlayersObjectRefresh
};