'use strict';
var socketio = require('socket.io');
var io = null;
var Promise = require('bluebird');
var Board = require('../db/models/index.js').Board;
var Game = require('../db/models/index.js').Game;
var Player = require('../db/models/index.js').Player;
var Deck = require('../db/models/index.js').Deck;
var Card = require('../db/models/index.js').Card;
var startGameFuncs = require('../app/logic/startGame.js')
var _ = require('lodash');


module.exports = function (server) {

    if (io) return io;
    io = socketio(server);

    var currentRoom;
    var newGame;
    var socketId;
    var clients;

	//hold all user socket ids with names and playerids (from db)
	var allPlayers = {};




    io.sockets.on('connection', function (socket) {
    	//hold the players objects for each game
    	var counter = 0;
    	var players = [];

    	//join all players to the correct room
    	socket.on('create', function(data) {
    		allPlayers[socket.id] = [];
    		allPlayers[socket.id].push(data.playername);
			currentRoom = data.roomname;
			socket.join(data.roomname);
    		if (data.localId) {
    			allPlayers[socket.id].push(data.localId);
    			// Player.find({where: {id: data.localId}})
    			// .then(function(data) {
    			// 	player = data;
    			// })
    		} else {

					Player.create({name: data.playername, money: 3})
					.then(function(data) {
						allPlayers[socket.id].push(data.dataValues.id);
						socket.emit('your id', {id: data.dataValues.id})
					})
    		}
				clients = io.sockets.adapter.rooms[data.roomname];
				for (var key in clients.sockets) {

					counter++;
				}

				// if player is first in room, allows them to start game
				if (counter===1) {
					// Game.create({name: currentRoom})
					// .then(function(game) {
					// 	return game.addPlayer(player)
					// })
					// .then(function(game) {
					// 		newGame = game;
						
					// })
					socket.emit('firstPlayer');
				} 
				// else {
				// 	Game.findOne({where: {name: currentRoom}, include: [Player]})
				// 	.then(function(game) {
				// 		console.log('game in here', game)
				// 		return game.addPlayer(player)
				// 	})
				// 	.then(function(game) {
				// 		newGame = game;
				// 	})
				// }
				// console.log("this is also room", io.sockets.adapter.rooms[currentRoom])
			});

			//when first player decides to start the game with the current num of players
			socket.on('startGame', function() {
				var hands = [];
				counter = 0;
				for (var key in clients.sockets) {
					counter++;
				}
				//change to limit min number of players
				if (counter >= 0) {
					//make an object to hold all the data about a player and push it to the players array
					Board.findAll({})
					.then(function(allBoards) {
						_.shuffle(allBoards);
						for (var i = 0; i < counter; i++) {
							var obj = {};
							obj.board = allBoards[i];
							obj.money = 3;
							obj.military = 0;
							obj.built = [];
							obj.socket = Object.keys(io.sockets.adapter.rooms[currentRoom].sockets)[i];
							obj.name = allPlayers[obj.socket][0];
							obj.playerId = allPlayers[obj.socket][1];
							players.push(obj);
    				}
    				return players;
    			})
  				.then(function() {
  					for (var x = 0; x < players.length; x++) {
  						// players[x].neighborR = 
  						// player[x].neighborL = 
  					}
						io.to(currentRoom).emit('game initialized', players)
  					return Deck.findOne({where: {numPlayers: counter, era: 1}, include: [Card]})
  				})
					.then(function(deck) {
						// newPlayers = [];
						_.shuffle(deck.cards)
						for (var x = 0; x < counter; x++) {
							hands.push(deck.cards.splice(0, 7));
						}
						return hands;
					})
					// .then(function() {
					// 	return Promise.map(players, function(player) {
					// 		return Player.findOne({where: {id: player.playerId}})
					// 	})
					// })
					.then(function() {
						for (var a = 0; a < players.length; a++) {
							io.sockets.connected[players[a].socket].emit('your hand', hands[a])
							players[a].hand = hands[a];
							return startGameFuncs,startGame(players, currentRoom);	
						}
						//is this a thing?
						// return player.setTemporary(hand)
					})
					.then(function(_players) {
						players = _players;
						// console.log('this is players', players, 'this is game', newGame[0][0].dataValues)
					})
					// .then(function(player) {
					// 	return player.setBoard(players[x].board)
					// })
					// .then(function(player) {
					// 	newPlayers.push(player)
					// })
							// console.log('hand', hand)
						
						// io.to(currentRoom).emit('cards', deck)

    			
    			//attach each object in the array a player's name and socket id
					// var num = 0;
					// for (var key in clients.sockets) {
					// 	console.log("this is playerss", players)
					// 	players[num].socket = key;
					// 	players[num].playername = allUsers[key]
					// 	num++;
					// }

				
			
					//divide cards and emit hand to each player
					
				Game.create({name: currentRoom})
				.then(function(game) {
					game.addPlayers(players)
				})

    		}
    	});

    	socket.on('choice made', function(card) {
    		//needs to check if the choice is ok and then 
    	});



    });
    
    return io;

};
