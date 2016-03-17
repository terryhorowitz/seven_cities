'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Game = db.define('User', {
    name: Sequelize.STRING,
    players: "",
    deck: "",
    discard: ""
  }, {
    timestamps: false  // this will deactivate the time columns
  });

  return Game;
};