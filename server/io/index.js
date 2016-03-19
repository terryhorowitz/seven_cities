'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;
    io = socketio(server);
    var currentRoom;

    io.sockets.on('connection', function (socket) {
    	var counter = 0;
    	//join all players to the correct room
    	socket.on('create', function(data) {
				currentRoom = data.roomname;
				socket.join(data.roomname);

				var clients = io.sockets.adapter.rooms[data.roomname];
				for (var key in clients.sockets) {
					counter++;
				}

				// if player is first in room, allows them to start game
				if (counter==1) {
					socket.emit('firstPlayer')
				}

    	});

    	//when first player decides to start the game with the current num of players
    	socket.on('startGame', function(playersNum) {
    		if (counter >= 3) {
					socket.broadcast.to(currentRoom).emit('game initialized', data)
    		}
    	});

    	socket.on('choice made', function(card) {
    		//needs to check if the choice is ok and then 
    	});



    });
    
    return io;

};
