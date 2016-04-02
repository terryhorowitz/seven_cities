'use strict';
var Game = require('../../db/models').Game;
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function () {

	var calculatePoints = function (player) {
		var totalPoints = 0;
		var totalMoney = 0;
		let wonders = player.wondersBuilt;

		console.log('**********player.tokens', player.tokens);

		// 	//calculate money and military points 
		if (player.tokens.length) {
			console.log('########player.tokens', player.tokens);
			let totalTokens = player.tokens.reduce(function(a, b) {
				return a + b;
			})
			totalPoints += totalTokens;  
		}

		totalPoints += Math.floor(player.money/3);

		totalMoney = player.money;

		//calculate wonder points
			
		return player.getBoard()
		.then(function(board) {
			// console.log('########player.wondersBuilt', wonders);
			// console.log('########board', board);

			for (let i = 1; i < wonders+1; i++) {
				// console.log('########inside the loop');
				//thisWonder will be a string such as 'wonder1'
				let thisWonder = `wonder${i}`;
				//check if board.wonder1 can be converted to number, then add that number to total points
				if (Number(board[thisWonder][0])) {
					totalPoints += Number(board[thisWonder][0]);
				}							
			}

			//calculate points from built cards

		return Promise.join(board, player.getPermanent());
		})
		.spread(function(board, builtCards) {
			//Technology Cards helper variables:
			let technologyCards = [0, 0, 0];//index 0 is tablet, index 1 is gear, index 2 is compass
			let scientistsGuild = false;

			//Trading Cards helper variables:
			let tradingCards = [];
			let processedCards = 0;
			let rawCards = 0;
			var guildCards = [];//serves for trading and for guild points
			let numGuildCards = 0;

			//One of Guild Points helper variable:
			let shipownersGuild = false;
		
			for (let card of builtCards) {
				//count Victory Points
				if (card.type === "Victory Points") {
					totalPoints += Number(card.functionality[0])
				}
				//count Technology Cards
				else if (card.type === "Technology") {
					if (card.functionality[0] === "tablet") technologyCards[0]++;
					else if (card.functionality[0] === "gear") technologyCards[1]++;
					else if (card.functionality[0] === "compass") technologyCards[2]++;
				}
				//collect guild cards
				else if (card.type === "Guild") {
					numGuildCards++;
					//check if the player has the scientists or the shipowners guild card:
					if (card.name === "Scientists Guild") scientistsGuild = true;
					else if (card.name === "Shipowners Guild") shipownersGuild = true;
					//only need to save guild cards if they are not the types above -> other types depend on neighbor resources
					else guildCards.push(card);
				}

				//collect trading cards
				else if (card.type === "Trading") {
					tradingCards.push(card);
				}
				//count processed cards
				else if (card.type === "Processed Resource") {
					processedCards++;
				}
				//count raw cards
				else if (card.type === "Raw Resource") {
					rawCards++;
				}
				
			}

			// count Technology Points

			//find the technology card the user has most of
			let max = Math.max.apply(null, technologyCards);
			let idx = technologyCards.indexOf(max);

			//if the player has the scientists guild card and/or the second wonder built in the Babylon board, increment the number of the highest card
			if (scientistsGuild) technologyCards[idx]++;
			if (board.name === "Babylon" && wonders > 1) technologyCards[idx]++;

			//add victory points for repeating cards
			// console.log('add to total points Math.pow(technologyCards[0], 2)', Math.pow(technologyCards[0], 2) + Math.pow(technologyCards[1], 2))
			totalPoints += Math.pow(technologyCards[0], 2) + Math.pow(technologyCards[1], 2) + Math.pow(technologyCards[2], 2);

			//find the minimum value of the technology cards
			let min = Math.min.apply(null, technologyCards);

			//add 7 victory points for groups of 3 different symbols
			totalPoints += min * 7;

			// count Trading Points
			for (let card of tradingCards) {
				if (card.name === "Lighthouse") {
					totalPoints += tradingCards.length;
				}
				else if (card.name === "Chamber of Commerce") {
					totalPoints += processedCards.length * 2;
				}
				else if (card.name === "Haven") {
					totalPoints += rawCards.length;
				}
				else if (card.name === "Arena") {
					totalPoints += wonders.length;
				}
			}

			// count points from the shipowners guild card
			if (shipownersGuild) totalPoints += processedCards + rawCards + numGuildCards;


			// if the player has other guild cards, execute this promise:

			if (guildCards.length) {
				return Promise.join(board, builtCards, guildCards, player.getLeftNeighbor(), player.getRightNeighbor())
				.spread(function(board, builtCards, guildCards, leftNeighbor, rightNeighbor) {
					return Promise.join(wonders, board, builtCards, guildCards, leftNeighbor, rightNeighbor, leftNeighbor.getPermanent(), rightNeighbor.getPermanent())
				})
				.spread(function(board, builtCards, guildCards, leftNeighbor, rightNeighbor, leftCards, rightCards) {
					for (let card of guildCards) {
						if (card.name === "Strategists Guild") {
							totalPoints += leftNeighbor.tokens[2] * -1 + rightNeighbor.tokens[2] * -1;
						} 
						else if (card.name === "Builders Guild") {
							return Promise.join(wonders, leftNeighbor.builtWonders(), rightNeighbor.builtWonders())
							.spread(function(leftWonders, rightWonders) {
								totalPoints += wonders + leftWonders +rightWonders;
							})
						} else {
							let left = _.filter(leftCards, {type: card.functionality[3]});
							let right = _.filter(rightCards, {type: card.functionality[3]});
							totalPoints += (left.length + right.length) * card.functionality[0];
						}
					}
				})	
			}// end if guildCards
			})
			.then(function() {
				console.log('totalPoints at the end', totalPoints)
				return { player: player, points: totalPoints, money: totalMoney}
			})
	}


	//when calling calculatePoints:
	//player.points = calculatePoints(player);

	var findWinner = function (allPlayers) {
		// console.log('allPlayers inside findWinner', allPlayers)
		var topScore = allPlayers.sort(function(a,b) {
	    	return a.points<b.points;
		});

		topScore.forEach(function(el, i) {
			el.position = i + 1;
		})
		// console.log('********** inside find Winner topScore', topScore)
		var winner = _.filter(allPlayers, {'points': topScore[0].points });
		// console.log('winner', winner)
		if (winner.length === 1) {
			// console.log('winner', winner[0])
			// console.log('winner', winner[0].player.dataValues.name)
			return [topScore, winner[0].player.dataValues.name]
		}
		else if (winner.length > 1) {
			console.log('more than one winner')
			var topMoney = winner.sort(function(a,b) {
				return a.money<b.money;
			});
			console.log('topMoney', topMoney)
			var moneyWinner = _.filter(topScore, {'money': topMoney[0].money });
			console.log('moneyWinner', moneyWinner)
			return [topScore, moneyWinner];
		} else {
			return "There was an error determining the winner";
		}
	}

	var clearPlayersfromDB = function (allPlayers) {
		_.map(allPlayers, function(player) {
			return Player.destroy({where: { id: player.id }})
		})
	}

	var clearGamefromDB = function (game) {
		return Game.destroy({where: { id: game.id }})
	}

	return {
		calculatePoints: calculatePoints,
	    findWinner: findWinner,
	    clearPlayersfromDB: clearPlayersfromDB,
	    clearGamefromDB: clearGamefromDB
	}
}
