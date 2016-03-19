var gameDBObj = require('../index.js').db;
var Game = require('./game')(gameDBObj);
var Player = require('./player')(gameDBObj);
var Board = require('./board')(gameDBObj);
var Deck = require('./deck')(gameDBObj);
var Card = require('./card')(gameDBObj);

Player.belongsTo(Board); 
Player.belongsToMany(Card, {through: 'BuiltCards'}); 
Player.belongsToMany(Card, {through: 'Hand'});
Player.belongsTo(Player, {as: "LeftNeighbor"});
Player.belongsTo(Player, {as: "RightNeighbor"});

Game.belongsToMany(Player, {through: "GamePlayers"});
Game.belongsToMany(Card, {through: "Discard"});
Game.belongsToMany(Deck, {through: "GameDeck"});

Deck.belongsToMany(Card, {through: "DeckCards"});

gameDBObj.sync();
//{force: true}

module.exports = {
  Game: Game,
  Player: Player,
  Board: Board,
  Deck: Deck,
  Card: Card
};