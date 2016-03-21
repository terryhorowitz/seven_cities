'use strict';

var Sequelize = require('sequelize');

var gameDB = new Sequelize('gamedb', '', null, {
  dialect: 'postgres',
  port: 5432
});

module.exports = {
  promiseForGameDB: gameDB
                    .authenticate()
                    .then(function(){
                      console.log("we're connected . . . now!")
                    })
                    .catch(function(err){
                      console.log('problem connecting:', err)
                    }),
  db: gameDB
}
