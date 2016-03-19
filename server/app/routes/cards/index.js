'use strict';
var router = require('express').Router();
var Card = require('../../../db/models/index').Card;
module.exports = router;

router.get('/', function(req, res, next){
  Card.findAll({})
  .then(function(cards){
    res.json('cards', cards)
  }).catch(next)
});

router.post('/', function(req, res, next){
  Card.create(req.body)
  .then(function(res){
    res.json(res)
  })
});