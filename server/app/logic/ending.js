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
	var playerBoard;
	var builtWonders = 0;
	var leftNeighborCards;
	var rightNeighborCards;

	//USE Promise.map?

	//this can be async
	function getMilitaryAndMoneyPoints (thisPlayer) {
		return Player.findOne({ where: { id: player.id }})
		.then(function (player) {
			let pointsCount = {
				points: player.tokens[0] - player.tokens[1] + Math.floor(player.money),
				money: player.money % 3
			}
			return pointsCount;
		})
		.then(function (pointsCount) {
			totalPoints += pointsCount.points;
			totalMoney += pointsCount.money;
		});
	}

	function getWonderPoints () {
			return player.builtWonders()
			.then(function (wonders) {
				builtWonders = wonders;
				return player.getBoard()
				.then(function (board) {
					playerBoard = board.name;
					var built = builtWonders;
					var count = 1;
					while (built > 0) {
						let thisWonder = `wonder${count}`;
						if (Number(board[thisWonder][0])) {
						 totalPoints += Number(board[thisWonder][0]);
						}							
						count++;
						built--;
					}
			})
		})
	}

	// need method sort cards by type - get cards by type and push them to array


	//chain these two functions!!!!!!!!!!!!!!!!!!!!!!!

	function getVictoryPoints (player) {
		return player.getPermanent()
		.then(function (builtCards) {

			//Technology Cards helper variables:
			let technologyCards = [0, 0, 0];//index 0 is tablet, index 1 is gear, index 2 is compass
			let scientistsGuild = false;

			//Trading Cards helper variables:
			let tradingCards = [];
			let processedCards = 0;
			let rawCards = 0;
			let guildCards = [];
			

			//implement map

			for (let card of builtCards) {
				//Victory Points
				if (card.type === "Victory Points") {
					totalPoints += Number(card.functionality[0])
				}
				//Technology Points
				else if (card.type === "Technology") {
					if (card.functionality[0] === "tablet") technologyCards[0]++;
					else if (card.functionality[0] === "gear") technologyCards[1]++;
					else if (card.functionality[0] === "compass") technologyCards[2]++;
				}
				else if (card.name === "Scientists Guild") scientistsGuild = true;
				//Trading Points
				else if (card.type === "Trading") {
					tradingCards.push(card);
				}
				else if (card.type === "Processed Resource") {
					processedCards++;
				}
				else if (card.type === "Raw Resource") {
					rawCards++;
				}
				else if (card.type === "Guild") {
					guildCards.push(card.functionality);
				}
			}

			//after looping through all cards, add technology points to total points:
			let max = Math.max(technologyCards);
			let idx = technologyCards.indexOf(max);

			if (scientistsGuild) technologyCards[idx]++;
			if (playerBoard === "Babylon" && builtWonders > 1) technologyCards[idx]++;

			totalPoints += Math.pow(technologyCards[0], 2) + Math.pow(technologyCards[1], 2) + Math.pow(technologyCards[2], 2);

			//after looping through all cards, check the cards in the tradingCards array and add points to totalPoints if applicable:
			for (let card of tradingCards) {
				if (card.name === "Lighthouse") {
					totalPoints += tradingCards.lenght();
				}
				else if (card.name === "Chamber of Commerce") {
					totalPoints += processedCards.lenght() * 2;
				}
				else if (card.name === "Haven") {
					totalPoints += rawCards.lenght();
				}
				else if (card.name === "Arena") {
					totalPoints += wonders.lenght();
				}
			}
		})
		
	}


	function getGuildPoints () {



		guildCards.forEach(function(card) {

			if (card[1] !== 'left') { //specific to the scientists guild card
				totalPoints += processedCards + rawCards + guildCards.lenght();
			} else {
				return player.getLeftNeighbor()
				.then(function(leftNeighbor) {
					return leftNeighbor.getPermanent();
				})
				.then(function(leftCards) {
					leftNeighborCards = leftCards;
					return player.getRightNeighbor()
					.then(function(rightNeighbor) {
						return leftNeighbor.getPermanent();
					})
					.then(function(rightCards) {
						rightNeighborCards = rightCards;
					})
				})
			}
			

			// if (card.name === "Strategists Guild") {}

			// if (card.name === "Workers Guild") {}

			// if (card.name === "Spies Guild") {}

			// if (card.name === "Magistrates Guild") {}

			// if (card.name === "Craftsmens Guild") {}

			// if (card.name === "Builders Guild") {}

			// if (card.name === "Philosophers Guild") {}

			// if (card.name === "Traders Guild") {}

			// if (card.name === "Shipowners Guild") {}

		})


	}

	return { points: totalPoints, money: totalMoney}

}