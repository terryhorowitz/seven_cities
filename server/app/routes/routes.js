'use strict';
var router = require('express').Router();
var Board = require('../../db/models/index').Board;
var Player = require('../../db/models/index').Player;
var Deck = require('../../db/models/index').Deck;
var Game = require('../../db/models/index').Game;
var Card = require('../../db/models/index').Card;
module.exports = router;


router.get('/board', function(req, res, next){
  Board.findAll()
  .then(function(boards){
    console.log('HOW MANY', boards.length)
    res.json(boards)
  }).catch(next)
});

router.get('/player', function(req, res, next){


  Player.findAll({include: [{ all: true }]})
  .then(function(players){
      // console.log('type of getPermanent: ', typeof players[0].getPermanent)
      // console.log('type of getTemporary: ', typeof players[0].getTemporary )
    console.log('HOW MANY', players.length)
    res.json(players)
  }).catch(next)
});

router.get('/deck', function(req, res, next){
  Deck.findAll({include: [Card]})
  .then(function(deck){
    console.log('HOW MANY', deck.length)
    res.json(deck)
  }).catch(next)
});

router.get('/game', function(req, res, next){

  Game.findAll({include: [{model: Deck}, {model: Player, as: 'GamePlayers', include: [{model: Card, as: 'Permanent'}, {model: Card, as: 'Temporary'}, {model: Player, as: 'LeftNeighbor'}, {model: Player, as: 'RightNeighbor'}, {model: Board}]}]})

  .then(function(games){
    console.log('HOW MANY', games.length)
    res.json(games)
  }).catch(next)
});

router.get('/card', function(req, res, next){
  Card.findAll()
  .then(function(cards){
    console.log('HOW MANY', cards.length)
    res.json(cards)
  }).catch(next)
});

router.delete('/game', function(req, res, next){
  Game.destroy({where: {}})
  .then(function() {
    res.send('destroyed!')
  }).catch(next)
});

router.delete('/player', function(req, res, next){
  Player.destroy({where: {}})
  .then(function() {
    res.send('destroyed!')
  }).catch(next)
});