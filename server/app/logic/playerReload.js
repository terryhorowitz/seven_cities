'use strict';

var Game = require('../../db/models').Game
var Player = require('../../db/models').Player

var playerReload = function (playerId, socket) {
        
    return Player.findById(playerId)
    .then(function(player) {
      return player.update({socket: socketId})
    })
    .then(function(updatedPlayer){
      // Game.findOne({where: {GamePlayers: {array: {$contains: [updatedPlayer.id]}}})
      return Game.findById(updatedPlayer.gameId);
    })
}
    
module.exports = {
    playerReload: playerReload
}
// }