'use strict';
var socketio = require('socket.io');
var io = null;
//Board = require('somepath').Board;

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

//hold all user socket ids with names
var allUsers = {};

module.exports = function (server) {

    if (io) return io;
    io = socketio(server);
    var currentRoom;

    io.sockets.on('connection', function (socket) {
    	var counter = 0;
    	//hold the players objects for each game
    	var players = [];

    	//join all players to the correct room
    	socket.on('create', function(data) {
				currentRoom = data.roomname;
				socket.join(data.roomname);

				var clients = io.sockets.adapter.rooms[data.roomname];
				for (var key in clients.sockets) {
					allUsers[key] = data.playername;
					counter++;
				}

				// if player is first in room, allows them to start game
				if (counter===1) {
					socket.emit('firstPlayer');
				}
			});

			//when first player decides to start the game with the current num of players
			socket.on('startGame', function() {
				if (counter >= 3) {

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
							players.push(obj);
    				}
    			})
    			//attach each object in the array a player's name and socket id
					var num = 0;
					for (var key in clients.sockets) {
						players[num].socket = key;
						players[num].playername = allUsers[key]
					}

					socket.broadcast.to(currentRoom).emit('game initialized', players)
    		}
    	});

    	socket.on('choice made', function(card) {
    		//needs to check if the choice is ok and then 
    	});



    });
    
    return io;

};
