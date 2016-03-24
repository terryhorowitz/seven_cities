'use strict';
var Sequelize = require('sequelize');

module.exports = function(db) {
  var Player = db.define('player', {
    name: Sequelize.STRING,
    money: Sequelize.INTEGER,
    socket: Sequelize.STRING,
    tokens: Sequelize.INTEGER,
    wondersBuilt: Sequelize.INTEGER
  }, {
    timestamps: true
  });
  return Player;
};