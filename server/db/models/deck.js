'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Deck = db.define('Deck', {
    numPlayers: Sequelize.INTEGER
  }, {
    timestamps: false
  });

  return Deck;
};