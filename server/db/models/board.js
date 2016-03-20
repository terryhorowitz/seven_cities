'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Board = db.define('board', {
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
    resource: Sequelize.STRING,
    wonder1: Sequelize.ARRAY,
    wonder1Cost: Sequelize.ARRAY,
    wonder2: Sequelize.ARRAY,
    wonder2Cost: Sequelize.ARRAY,
    wonder3: Sequelize.ARRAY,
    wonder3Cost: Sequelize.ARRAY,
    side: Sequelize.INTEGER
  }, {
    timestamps: false
  });

  return Board;
};