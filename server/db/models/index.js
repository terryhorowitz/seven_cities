var gameDBObj = require('../index.js').db;
var Game = require('./game')(gameDBObj);
var Player = require('./player')(gameDBObj);
var Board = require('./board')(gameDBObj);
var Deck = require('./deck')(gameDBObj);
var Card = require('./card')(gameDBObj);

Player.belongsTo(Board); 

Player.belongsToMany(Card, {through: 'built_card', as: 'Permanent', timestamps: false});
Card.belongsToMany(Player, {through: 'built_card', timestamps: false}); 

Player.belongsToMany(Card, {through: 'hand', as: 'Temporary', timestamps: false});
Card.belongsToMany(Player, {through: 'hand', timestamps: false});

Player.belongsTo(Player, {as: "LeftNeighbor", timestamps: false});
Player.belongsTo(Player, {as: "RightNeighbor", timestamps: false});

Game.belongsToMany(Player, {through: "GamePlayers", timestamps: false});
Game.belongsToMany(Card, {through: "Discard", as: "Discard", timestamps: false});
Game.belongsToMany(Deck, {through: "GameDeck", timestamps: false});

Deck.belongsToMany(Game, {through: "DeckGame", timestamps: false});

Deck.belongsToMany(Card, {through: "DeckCards", timestamps: false});

gameDBObj.sync();

module.exports = {
  Game: Game,
  Player: Player,
  Board: Board,
  Deck: Deck,
  Card: Card
};