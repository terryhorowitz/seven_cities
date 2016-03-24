'use strict';

var Game = require('../../db/models').Game
var Player = require('../../db/models').Player
var Deck = require('../../db/models').Deck
var Card = require('../../db/models').Card
var Board = require('../../db/models').Board

var playerReload = function (playerId, socketId) {
        
    return Player.findById(playerId)
    .then(function(player) {
      return player.update({socket: socketId})
    })
    .then(function(updatedPlayer){
      // Game.findOne({where: {GamePlayers: {array: {$contains: [updatedPlayer.id]}}})
      return Game.findOne({where: {id: updatedPlayer.gameId}, include: [{model: Deck}, {model: Player, as: 'GamePlayers', include: [{model: Card, as: 'Permanent'}, {model: Card, as: 'Temporary'}, {model: Player, as: 'LeftNeighbor'}, {model: Player, as: 'RightNeighbor'}, {model: Board}]}]});
    })
}
    
module.exports = {
    playerReload: playerReload
}
// }