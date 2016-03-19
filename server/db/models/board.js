'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Board = db.define('Board', {
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
    resource: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Board;
};