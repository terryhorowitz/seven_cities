var gameDBObj = require('../index.js').db;
var Game = require('./game')(gameDBObj);
var Player = require('./player')(gameDBObj);
var Board = require('./board')(gameDBObj);
var Deck = require('./deck')(gameDBObj);
var Card = require('./card')(gameDBObj);

gameDBObj.sync();

Player.belongsTo(Board); 
Player.belongsToMany(Card, {through: 'BuiltCards', timestamps: false}); 
Player.belongsToMany(Card, {through: 'Hand', timestamps: false});
Player.belongsTo(Player, {as: "LeftNeighbor", timestamps: false});
Player.belongsTo(Player, {as: "RightNeighbor", timestamps: false});

Game.belongsToMany(Player, {through: "GamePlayers", timestamps: false});
Game.belongsToMany(Card, {through: "Discard", timestamps: false});
Game.belongsToMany(Deck, {through: "GameDeck", timestamps: false});

Deck.belongsToMany(Card, {through: "DeckCards", timestamps: false});

module.exports = {
  Game: Game,
  Player: Player,
  Board: Board,
  Deck: Deck,
  Card: Card
};