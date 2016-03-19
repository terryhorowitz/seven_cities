'use strict';
var router = require('express').Router();
var Card = require('../../../db/models/index').Card;
module.exports = router;

router.get('/', function(req, res, next){
  Card.findAll({})
  .then(function(cards){
    console.log('HOW MANY', cards.length)
    res.json(cards)
  }).catch(next)
});

router.post('/', function(req, res, next){
  Card.create(req.body)
  .then(function(response){
    res.json(response.data)
  }).catch(next)
});