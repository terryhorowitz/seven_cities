'use strict';
var socketio = require('socket.io');
var io = null;
var Board = require('../db/models/index.js').Board;
var Game = require('../db/models/index.js').Game;
var Player = require('../db/models/index.js').Player;
var Deck = require('../db/models/index.js').Deck;
var Card = require('../db/models/index.js').Card;

//for anything that requires shuffling
function shuffle (array) {
  var i = 0,
  j = 0,
  temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


module.exports = function (server) {

    if (io) return io;
    io = socketio(server);
    var currentRoom;
    var newGame;
    var player;
    var socketId;
    var clients;
    var thisSocket;
	//hold all user socket ids with names
	var allPlayers = {};

    io.sockets.on('connection', function (socket) {
    	thisSocket = socket;
    	var counter = 0;
    	//hold the players objects for each game
    	var players = [];

    	//join all players to the correct room
    	socket.on('create', function(data) {
    		allPlayers[socket.id] = data.playername;
				currentRoom = data.roomname;
				socket.join(data.roomname);
    		if (data.localId) {
    			Player.find({where: {id: data.localId}})
    			.then(function(data) {
    				player = data;
    			})
    		} else {
					Player.create({name: data.playername, money: 3})
					.then(function(data) {
						player = data;
						socket.emit('your id', {id: player.dataValues.id})
					})
    		}
				clients = io.sockets.adapter.rooms[data.roomname];
				for (var key in clients.sockets) {
					// allPlayers[key] = data.playername;
					counter++;
				}

				// if player is first in room, allows them to start game
				if (counter===1) {
					Game.create({name: currentRoom})
					.then(function(game) {
						game.addPlayer(player)
						newGame = game;
					})
					socket.emit('firstPlayer');
				} else {
					Game.find({where: {name: currentRoom}})
					.then(function(game) {
						game.addPlayer(player)
						
					})
				}
				// console.log("this is also room", io.sockets.adapter.rooms[currentRoom])
			});

			//when first player decides to start the game with the current num of players
			socket.on('startGame', function() {
				counter = 0;
				for (var key in clients.sockets) {
					counter++;
				}
				//change to limit min number of players
				if (counter >= 0) {
					//make an object to hold all the data about a player and push it to the players array
					Board.findAll({})
					.then(function(allBoards) {
						shuffle(allBoards);
						for (var i = 0; i < counter; i++) {
							var obj = {};
							obj.board = allBoards[i];
							obj.money = 3;
							obj.military = 0;
							obj.built = [];
							obj.socket = Object.keys(io.sockets.adapter.rooms[currentRoom].sockets)[i];
							obj.name = allPlayers[obj.socket];
							players.push(obj);
    				}
						io.to(currentRoom).emit('game initialized', players)
    			})
    			//attach each object in the array a player's name and socket id
					// var num = 0;
					// for (var key in clients.sockets) {
					// 	console.log("this is playerss", players)
					// 	players[num].socket = key;
					// 	players[num].playername = allUsers[key]
					// 	num++;
					// }

					//divide and emit hand to each player
					Deck.find({where: {numPlayers: counter, era: 1}, include: [Card]})
					.then(function(deck) {
						console.log('this is deck', deck)
					})
    		}
    	});

    	socket.on('choice made', function(card) {
    		//needs to check if the choice is ok and then 
    	});



    });
    
    return io;

};
