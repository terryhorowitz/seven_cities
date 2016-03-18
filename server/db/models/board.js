'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Board = db.define('Board', {
    name: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Board;
};