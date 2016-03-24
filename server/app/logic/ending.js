'use strict';
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var gameResources = require('./game_resources.js');
var Promise = require('bluebird');
var _ = require('lodash');


var calculatePoints = function (thisPlayer) {
	var totalPoints = 0;
	var totalMoney = 0;

	//USE IIFE???

	function getMilitaryPoints (thisPlayer) {
		return Player.findOne({ where: { id: player.id }})
		.then(function (player) {
			return player.tokens;
		})
		.then(function (tokens) {
			totalPoints += tokens;
		});
	}
	
	function getMoneyPoints () {
		// totalMoney += player.money % 3;
		// totalPoints += Math.floor(player.money);

	}

	function getWonderPoints () {
		//find which wonders have been built by player
		//may be in gameResources?
		//get array wonders = [1, 2, 3]
		// get board;

		// then -> wonders.forEach(function (wonder) {
		// 	let thisWonder = `wonder${wonder}`;
		// 	if (Number(board.[thisWonder][0])) totalPoints += Number(board.[thisWonder][0])			
		// })
	}

	function getVictoryPoints () {
		// find player built_card or Permanent cards where card.type === "Victory Points";

		// then -> for each card:
		// totalPoints += Number(card.functionality[0])
	}

	function getTechnologyPoints () {
		// find player built_card or Permanent cards where card.type === "Technology";

		let technologyCards = [0, 0, 0];

		// then -> for each card:

		// if (card.functionality[0] === "tablet") technologyCards[0]++;

		// if (card.functionality[0] === "gear") technologyCards[1]++;

		// if (card.functionality[0] === "compass") technologyCards[2]++;

		let max = Math.max(technologyCards);
		let idx = technologyCards.indexOf(max);

		//then -> find player cards where card.name === "Scientists Guild"

		//if card is found -> 
		technologyCards[idx]++;

		//then -> if board.name === "Babylon" && wonder2 is built
		technologyCards[idx]++;


		totalPoints += Math.pow(tablet, 2) + Math.pow(gear, 2) + Math.pow(compass, 2);

	}

	function getTradingPoints () {
		// find player built_card or Permanent cards where card.type === "Trading"

		//then array of trading cards
		let tradingCards = [data]

		tradingCards.forEach(function(card) {

			if (card.name === "Lighthouse") {
				totalPoints += tradingCards.lenght();
			}

			if (card.name === "Chamber of Commerce") {
				// find player built_card or Permanent cards where card.type === "Processed Resource"

				//then array of processed resource cards

				let processedCards = [data];

				totalPoints += processedCards.lenght() * 2;
			}

			if (card.name === "Haven") {
				// find player built_card or Permanent cards where card.type === "Raw Resource"

				//then array of raw resource cards

				let rawCards = [data];

				totalPoints += rawCards.lenght();
			}

			if (card.name === "Arena") {
				//find which wonders have been built by player
				//may be in gameResources?
				//get array wonders = [1, 2, 3]

				let wonders = [data];

				totalPoints += wonders.lenght();
			}

		})

	}

	function getGuildPoints () {

		// find player built_card or Permanent cards where card.type === "Guild"

		//then array of guild cards
		let tradingCards = [data]

		tradingCards.forEach(function(card) {

			if (card.name === "Strategists Guild") {}

			if (card.name === "Workers Guild") {}

			if (card.name === "Spies Guild") {}

			if (card.name === "Magistrates Guild") {}

			if (card.name === "Craftsmens Guild") {}

			if (card.name === "Builders Guild") {}

			if (card.name === "Philosophers Guild") {}

			if (card.name === "Traders Guild") {}

			if (card.name === "Shipowners Guild") {}


		})


	}

	return { points: totalPoints, money: totalMoney}

}