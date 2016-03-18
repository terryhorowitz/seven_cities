var promiseForGameDB = require('../index.js');
var Game = require('./game')(promiseForGameDB);
var Player = require('./player.js')(promiseForGameDB);
var Board = require('./board')(promiseForGameDB);
var Deck = require('./deck')(promiseForGameDB);
var Card = require('./card')(promiseForGameDB);

Player.hasOne(Board); //will now have methods: player.getBoard and player.setBoard
Player.hasMany(Card, {as: 'BuiltCards'}); //will have player.getBuiltCards and player.setBuiltCards
Player.hasMany(Card, {as: 'Hand'});//will have player.getHand and player.setHand
Player.hasOne(Player, {as: "LeftNeighbor"});
Player.hasOne(Player, {as: "RightNeighbor"});

Player.belongsTo(Game);//has player.getGame and player.setGame but key stored on Game

Game.hasMany(Player); //game.getPlayers/game.setPlayers
Game.hasMany(Card, {as: "Discard"});
Game.hasMany(Deck);

Deck.hasMany(Card);

Card.hasOne(Deck);

module.exports = {
  
}