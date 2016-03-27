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

var createPlayersObjectRefresh = function(GamePlayers) {
	var players =[];
	for (var m = 0; m < GamePlayers.length; m++) {
		var obj = {};
		obj.board = GamePlayers[m].board;
		obj.money = GamePlayers[m].money;
		obj.pluses = sortTokens(GamePlayers[m].tokens).plus;
		obj.minuses = sortTokens(GamePlayers[m].tokens).min;
		obj.built = GamePlayers[m].Permanent;
		obj.playerId = GamePlayers[m].id;
		obj.socket = GamePlayers[m].socket;
		obj.name = GamePlayers[m].name;
		obj.neighborL = GamePlayers[m].LeftNeighbor.socket;
		obj.neighborR = GamePlayers[m].RightNeighbor.socket;

		obj.builtView = sortBuiltCards(GamePlayers[m].Permanent);
		players.push(obj);
	}
	return players;
};

function sortBuiltCards (cards){
	var sorted = [[],[],[],[],[],[]];
	var cardTypeMap = {
		"Raw Resource": 0,
		"Processed Resource": 1,
		"Trading": 2,
		"War": 3,
		"Technology": 4,
		"Victory Points": 5,
		"Guild": 6
	}

	cards.forEach(function(c){
		sorted[cardTypeMap[c.type]].push('img/' + c.picture);
	});
	console.log('did i organize?', sorted)
	return sorted;

}

function sortTokens(tokensArr) {
	var pluses = 0;
	var minuses = 0;
	tokensArr.forEach(function(token) {
		if (token === -1) {
			minuses += 1;
		} else {
			pluses += token;
		}
	})
	return {plus: pluses, min: minuses}
}
    
module.exports = {
    createPlayersObject: createPlayersObject,
    createPlayersObjectRefresh: createPlayersObjectRefresh
};