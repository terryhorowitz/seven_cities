var gameDBObj = require('../index.js').db;
var Game = require('./game')(gameDBObj);
var Player = require('./player')(gameDBObj);
var Board = require('./board')(gameDBObj);
var Deck = require('./deck')(gameDBObj);
var Card = require('./card')(gameDBObj);

Player.belongsTo(Board); 
Player.belongsToMany(Card, {through: 'BuiltCards', timeStamps: false}); 
Player.belongsToMany(Card, {through: 'Hand', timeStamps: false});
Player.belongsTo(Player, {as: "LeftNeighbor", timeStamps: false});
Player.belongsTo(Player, {as: "RightNeighbor", timeStamps: false});

Game.belongsToMany(Player, {through: "GamePlayers", timeStamps: false});
Game.belongsToMany(Card, {through: "Discard", timeStamps: false});
Game.belongsToMany(Deck, {through: "GameDeck", timeStamps: false});

Deck.belongsToMany(Card, {through: "DeckCards", timeStamps: false});

//gameDBObj.sync({force: true});

module.exports = {
  Game: Game,
  Player: Player,
  Board: Board,
  Deck: Deck,
  Card: Card
};