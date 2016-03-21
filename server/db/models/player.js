'use strict';
var Sequelize = require('sequelize');

module.exports = function(db) {
  var Player = db.define('player', {
    name: Sequelize.STRING,
    money: Sequelize.INTEGER,
    tokens: Sequelize.INTEGER
  }, {
    timestamps: false
  });
  return Player;
};