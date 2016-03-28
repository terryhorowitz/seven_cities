var Board = require('../../db/models/index.js').Board;
var Game = require('../../db/models/index.js').Game;
var Player = require('../../db/models/index.js').Player;
var Deck = require('../../db/models/index.js').Deck;
var Card = require('../../db/models/index.js').Card;
var Promise = require('bluebird');

module.exports = {

    getGame: function(gameId){
        return Game.findOne({where: {id: gameId}, include: [{model: Deck}, {model: Player, as: 'GamePlayers', include: [{model: Card, as: 'Permanent'}, {model: Card, as: 'Temporary'}, {model: Player, as: 'LeftNeighbor'}, {model: Player, as: 'RightNeighbor'}, {model: Board}]}]});
    }, 
  
    getNeighbors: function(player){
      return Promise.join(player.getLeftNeighbor(), player.getRightNeighbor())
    },
  
    getPlayer: function (playerId){
      return Player.findOne({where: {id: playerId}, include: [{all:true}]})
    }, 
  
    getCard: function (cardId){
      return Card.findOne({where: {id: cardId}, include: [{all:true}]})
    }, 
  
    getPermanentForLR: function(query, left, right){
     return Promise.join(left.getPermanent(query), right.getPermanent(query))    
    }, 
                         
    getTemporaryForLR: function(query, left, right){
     return Promise.join(left.getTemporary(query), right.getTemporary(query))    
    }
}
