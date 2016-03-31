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
var helpers = require('../app/logic/socketHelpers.js');
var playCard = require('../app/logic/play_card.js')();
var endOfEra = require('../app/logic/endOfEra.js');


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
		currentRoom = helpers.findRoomName(socket.rooms);
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
					players = helpers.createPlayersObjectRefresh(thisGame.GamePlayers)
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
				} else if (counter===7) {
					helpers.startNewGame(currentRoom, counter, allPlayers, io);
				}
			}
		});
		//when first player decides to start the game with the current num of players
		socket.on('startGame', function() {
			currentRoom = helpers.findRoomName(socket.rooms);
			// var hands = [];
			counter = 0;
			for (var key in clients.sockets) {
				counter++;
			}
			//limit min number of players
			if (counter >= 3) {
				//make an object to hold all the data about a player and push it to the players array
				helpers.startNewGame(currentRoom, counter, allPlayers, io);
			//handle error: not enough players
			} else {
				io.sockets.connected[socket.id].emit('err', {message: 'Need at least 3 players to play!'});
			}
		});
	socket.on('choice made', function(data) {
<<<<<<< HEAD
      currentRoom = helpers.findRoomName(socket.rooms);
      //needs to check if the choice is ok and then emit
      var cardId = data.card;
      var playerId = data.player;
      var response;
      var options = ['Discard'];
      
      return playCardOptions.checkSelectedCardOptions(playerId, cardId)
      .then(function(playerSelections){
        return Promise.join(playerSelections, playCardOptions.checkIfPlayerCanBuildWonder(playerId))
      })
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
=======
		currentRoom = helpers.findRoomName(socket.rooms);
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
		})
	});
>>>>>>> master

	socket.on('send msg', function(data){
		currentRoom = helpers.findRoomName(socket.rooms);
		io.to(currentRoom).emit('get msg', data)
	})

	socket.on('submit choice', function(data) {
		currentRoom = helpers.findRoomName(socket.rooms);
                var peopleInRoom = 0;
      
    clients = io.sockets.adapter.rooms[currentRoom];
      for (var key in clients.sockets) {
          peopleInRoom++;
      }

		playersChoices.push(data)

    if (playersChoices.length === peopleInRoom){
      return playCard(playersChoices)

      .then(function(results) { //[game, [warResults, era]]
        console.log('playersChoices', playersChoices)
        if (results.length>1) {
	        let game = results[0];
        	let warResults = results[1][0];
        	let era = results[1][1];
        	io.to(currentRoom).emit('war results', warResults);
          return endOfEra.eraEnded(game, era)
          .then(function(game){
                playersChoices = [];
                console.log('game.GamePlayers in new round', game.GamePlayers)
                players = helpers.createPlayersObjectRefresh(game.GamePlayers)
                console.log('new round players', players)
                io.to(currentRoom).emit('new round', players);
                game.GamePlayers.forEach(function(player) {
                io.sockets.connected[player.socket].emit('your hand', player.Temporary);
        })
        })
        }
        else {
        	let game = results;
	        // console.log('********************No war')
	        // can refactor this repetion
	      	playersChoices = [];
	      	console.log('game.GamePlayers in new round', game.GamePlayers)
	      	players = helpers.createPlayersObjectRefresh(game.GamePlayers)
	        console.log('new round players', players)
	      	io.to(currentRoom).emit('new round', players);
	      	game.GamePlayers.forEach(function(player) {
	            io.sockets.connected[player.socket].emit('your hand', player.Temporary);
	      	})
	      }
        	
        })

    } else {
    	var waiting = allPlayers[socket.id][0]
    	io.to(currentRoom).emit('waiting on', waiting);
    }

	})
});
  
  return io;
};

