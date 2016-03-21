'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Board = db.define('board', {
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
    resource: Sequelize.STRING,
    wonder1: Sequelize.ARRAY(Sequelize.STRING),
    wonder1Cost: Sequelize.ARRAY(Sequelize.STRING),
    wonder2: Sequelize.ARRAY(Sequelize.STRING),
    wonder2Cost: Sequelize.ARRAY(Sequelize.STRING),
    wonder3: Sequelize.ARRAY(Sequelize.STRING),
    wonder3Cost: Sequelize.ARRAY(Sequelize.STRING),
    side: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Board;
};