'use strict';

var Game = require('../../db/models').Game;
var Player = require('../../db/models').Player;
var Deck = require('../../db/models').Deck;
var Card = require('../../db/models').Card;
var Board = require('../../db/models').Board;
var _ = require('lodash');
var startGameFuncs = require('./startGame.js');



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
        obj.wondersBuilt = GamePlayers[m].wondersBuilt;
		obj.neighborL = GamePlayers[m].LeftNeighbor.socket;
		obj.neighborR = GamePlayers[m].RightNeighbor.socket;

		obj.builtView = sortBuiltCards(GamePlayers[m].Permanent);
		players.push(obj);
	}
	return players;
};

function startNewGame(currentRoom, counter, allPlayers, io) {
	var hands = [];
	var players;
	Board.findAll({})
	.then(function(allBoards) {
		allBoards = _.shuffle(allBoards);
		var allSockets = Object.keys(io.sockets.adapter.rooms[currentRoom].sockets);

		players = createPlayersObject(allBoards, counter, allSockets, allPlayers)
	})
	.then(function() {
		io.to(currentRoom).emit('game initialized', players);
		return Deck.findOne({where: {numPlayers: counter, era: 1}, include: [Card]});
	})
	.then(function(deck) {
		deck.cards = _.shuffle(deck.cards);
		for (var x = 0; x < counter; x++) {
			hands.push(deck.cards.splice(0, 7));
		}
		return hands;
	})
	.then(function(hands) {
		for (var a = 0; a < players.length; a++) {
			io.sockets.connected[players[a].socket].emit('your hand', hands[a]);
			players[a].hand = hands[a];
		}
		return startGameFuncs.startGame(players, currentRoom);
	})
	.then(function(gameObject) {
		players = players.map(function(player) {
			var current = _.find(gameObject.GamePlayers, {'socket': player.socket})
				player.playerId = current.id;
				io.sockets.connected[player.socket].emit('your id', current.id);
				return player;
		})
	})
}

function findRoomName(roomsObj) {
	var roomsArr = Object.keys(roomsObj).map(function(k) { return roomsObj[k] });
	var newArr = roomsArr.filter(function(el) {
		return el[0] !== '/';
	})
	return newArr[0];
}

function sortBuiltCards (cards){
	var sorted = [[],[],[],[],[],[],[]];
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
	findRoomName: findRoomName,
	startNewGame: startNewGame,
    createPlayersObject: createPlayersObject,
    createPlayersObjectRefresh: createPlayersObjectRefresh
};