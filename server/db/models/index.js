var promiseForGameDB = require('../index.js');
var Game = require('./game')(promiseForGameDB);
var Player = require('./player.js')(promiseForGameDB);
var Board = require('./board')(promiseForGameDB);
var Deck = require('./deck')(promiseForGameDB);
var Card = require('./card')(promiseForGameDB);

Player.belongsTo(Board); 
Player.belongsToMany(Card, {as: 'BuiltCards'}); 
Player.belongsToMany(Card, {as: 'Hand'});
Player.belongsTo(Player, {as: "LeftNeighbor"});
Player.belongsTo(Player, {as: "RightNeighbor"});

Game.belongsToMany(Player);
Game.belongsToMany(Card, {as: "Discard"});
Game.belongsToMany(Deck);

Deck.belongsToMany(Card);

module.exports = {
  Game: Game,
  Player: Player,
  Board: Board,
  Deck: Deck,
  Card: Card
};