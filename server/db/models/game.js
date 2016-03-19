'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Game = db.define('game', {
    name: Sequelize.STRING
  }, {
    timestamps: false  // want time stamps?
  });

  return Game;
};