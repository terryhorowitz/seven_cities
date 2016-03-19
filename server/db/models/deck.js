'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Deck = db.define('deck', {
    numPlayers: Sequelize.INTEGER,
    era: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Deck;
};