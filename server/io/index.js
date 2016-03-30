'use strict';
var socketio = require('socket.io');
var io = null;
var Promise = require('bluebird');
var Board = require('../db/models/index.js').Board;
var Game = require('../db/models/index.js').Game;
var Player = require('../db/models/index.js').Player;
var Deck = require('../db/models/index.js').Deck;
var Card = require('../db/models/index.js').Card;
var startGameFuncs = require('../app/logic/startGame.js');
var playCardOptions = require('../app/logic/play_card_options.js')();
var _ = require('lodash');
var playerReload = require('../app/logic/playerReload.js');
var createPlayers = require('../app/logic/createPlayersObject.js');
var playCard = require('../app/logic/play_card.js')();

module.exports = function (server) {
  if (io) return io;
  io = socketio(server);
  var currentRoom;
  var newGame;
  var socketId;
  var clients;
  var playersChoices = [];
	//hold all user socket ids with names and playerids (from db)
	var allPlayers = {};
  io.sockets.on('connection', function (socket) {
  //hold the players objects for each game
		var counter = 0;
		var players = [];
		var gameObject;
		//join all players to the correct room
		socket.on('create', function(data) {
			//this whole if is for dealing with a user refreshing during a game. local storage!
			if (data.localId) {
				var thisGame;
				var thisHand;
				playerReload.playerReload(data.localId, socket.id)
				.then(function(game) {
					allPlayers[socket.id] = [];
					allPlayers[socket.id].push(data.localId)
					thisGame = game;
					socket.join(game.name);
					players = createPlayers.createPlayersObjectRefresh(thisGame.GamePlayers)
					io.sockets.connected[socket.id].emit('game initialized', players);
					var me = _.find(thisGame.GamePlayers, {'socket': socket.id})
					io.sockets.connected[socket.id].emit('your hand', me.Temporary);
					allPlayers[socket.id].push(me.playername);
				})
			} else {
				allPlayers[socket.id] = [];
				allPlayers[socket.id].push(data.playername);
				currentRoom = data.roomname;
				socket.join(data.roomname);
				clients = io.sockets.adapter.rooms[data.roomname];
				var namesOfPlayers = [];
				for (var key in clients.sockets) {
					counter++;
					namesOfPlayers.push(allPlayers[key][0])
				}
				io.to(currentRoom).emit('in room', namesOfPlayers);
				// if player is first in room, allows them to start game
				if (counter===1) {
					socket.emit('firstPlayer');
				}
			}
		});
		//when first player decides to start the game with the current num of players
		socket.on('startGame', function() {
			var hands = [];
			counter = 0;
			for (var key in clients.sockets) {
				counter++;
			}
			//change to limit min number of players
			if (counter >= 3) {
				//make an object to hold all the data about a player and push it to the players array
				Board.findAll({})
				.then(function(allBoards) {
					allBoards = _.shuffle(allBoards);
					var allSockets = Object.keys(io.sockets.adapter.rooms[currentRoom].sockets);
					players = createPlayers.createPlayersObject(allBoards, counter, allSockets, allPlayers)
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
							// console.log('!!!!!!! right before emitting')
							io.sockets.connected[player.socket].emit('your id', current.id);
							return player;
					})
				})
			//handle error: not enough players
			} else {
				io.sockets.connected[socket.id].emit('err', {message: 'Need at least 3 players to play!'});
			}
		});
	socket.on('choice made', function(data) {
		//needs to check if the choice is ok and then emit
		var cardId = data.card;
		var playerId = data.player;
		var response;
		var options = ['Discard'];
//		return playCardOptions.checkSelectedCardOptions(playerId, cardId)
        return Promise.join(playCardOptions.checkSelectedCardOptions(playerId, cardId), playCardOptions.checkIfPlayerCanBuildWonder(playerId))
		.spread(function(cardOptions, wonderOptions) {
            if (typeof wonderOptions !== "string") wonderOptions.wonder = true;
            else if (typeof wonderOptions === "string") wonderOptions = "wonder " + wonderOptions;
            if (typeof cardOptions !== 'string') cardOptions.wonder = false;
			options.push(cardOptions);
            options.push(wonderOptions);
			io.sockets.connected[socket.id].emit('your options', options);
			//check if player can build wonders
		})
	});

	socket.on('send msg', function(data){
		io.to(currentRoom).emit('get msg', data)
	})

	socket.on('submit choice', function(data) {
        var peopleInRoom = 0;
      
        clients = io.sockets.adapter.rooms[currentRoom];
	        for (var key in clients.sockets) {
	            peopleInRoom++;
	        }

		playersChoices.push(data)

        if (playersChoices.length === peopleInRoom){
          return playCard(playersChoices)
          .then(function(game) {
          	playersChoices = [];
          	players = createPlayers.createPlayersObjectRefresh(game.GamePlayers)
          	io.to(currentRoom).emit('new round', players);
          	game.GamePlayers.forEach(function(player) {
                io.sockets.connected[player.socket].emit('your hand', player.Temporary);
          	})
          })
        }
        
		// return playCard(data.playerId, data.cardId, data.selection)
		// .then(function(game) {

		// })
	})
  });
  
  return io;
};