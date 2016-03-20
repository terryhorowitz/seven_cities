'use strict';
var router = require('express').Router();
var Deck = require('../../../db/models/index').Deck;
var Card = require('../../../db/models/index').Card;
module.exports = router;

router.get('/', function(req, res, next){
  Deck.findAll({include: [Card], where: {id:1}})
  .then(function(cards){
    console.log('HOW MANY', cards.length)
    res.json(cards)
  }).catch(next)
});

router.get('/some', function(req, res, next){
  Deck.find({id: 1})
  .then(function(cards){
    console.log('HOW MANY', cards.length)
    res.json(cards)
  }).catch(next)
});

router.post('/', function(req, res, next){
  Deck.create(req.body)
  .then(function(response){
    res.json(response.data)
  }).catch(next)
});