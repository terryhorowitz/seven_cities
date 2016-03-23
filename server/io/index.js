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
					socket.emit('firstPlayer');
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
				if (counter >= 0) {
					//make an object to hold all the data about a player and push it to the players array
					Board.findAll({})
					.then(function(allBoards) {
						_.shuffle(allBoards);
						for (var i = 0; i < counter; i++) {
							var obj = {};
							obj.board = allBoards[i];
							obj.money = 3;
							obj.tokens = 0;
							obj.built = [];
							obj.socket = Object.keys(io.sockets.adapter.rooms[currentRoom].sockets)[i];
							obj.name = allPlayers[obj.socket][0];
							players.push(obj);
    				}
    				return players;
    			})
  				.then(function() {
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
						io.to(currentRoom).emit('game initialized', players)
  					return Deck.findOne({where: {numPlayers: counter, era: 1}, include: [Card]})
  				})
					.then(function(deck) {
						_.shuffle(deck.cards)
						for (var x = 0; x < counter; x++) {
							hands.push(deck.cards.splice(0, 7));
						}
						return hands;
					})
					.then(function() {
						for (var a = 0; a < players.length; a++) {
							io.sockets.connected[players[a].socket].emit('your hand', hands[a])
							players[a].hand = hands[a];
							startGameFuncs.startGame(players, currentRoom);	
						}		
					})

    		}
    	});

    	socket.on('choice made', function(card, playerid) {
    		//needs to check if the choice is ok and then

    	});



    });
    
    return io;

};
