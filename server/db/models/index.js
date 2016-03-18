var promiseForGameDB = require('../index.js');
var Game = require('./game')(promiseForGameDB);
var Player = require('./player.js')(promiseForGameDB);
var Board = require('./board')(promiseForGameDB);
var Deck = require('./deck')(promiseForGameDB);
var Card = require('./card')(promiseForGameDB);

Player.belongsTo(Board); //will now have methods: player.getBoard and player.setBoard
Player.belongsToMany(Card, {as: 'BuiltCards'}); //will have player.getBuiltCards and player.setBuiltCards
Player.belongsToMany(Card, {as: 'Hand'});//will have player.getHand and player.setHand
Player.belongsTo(Player, {as: "LeftNeighbor"});
Player.belongsTo(Player, {as: "RightNeighbor"});

//Player.belongsTo(Game);//has player.getGame and player.setGame but key stored on Game

Game.belongsToMany(Player); //game.getPlayers/game.setPlayers
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