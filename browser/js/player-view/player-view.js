app.config(function ($stateProvider) {

    $stateProvider.state('playerView', {
        url: '/player-view',
        controller: 'GameController',
        templateUrl: 'js/player-view/player-view.html'
    });

});

app.controller('PlayerViewController', function ($scope, $state) {

	var socket = io(window.location.origin); 
    $scope.roomname = $state.params.roomname;
    $scope.playername = $state.params.playername;

    $scope.firstPlayer = false;
    $scope.builtCards;
    $scope.players;
    $scope.money;
    $scope.currentlyPlaying;
    $scope.me;
    $scope.myHand;
    $scope.rightNeighbor;
    $scope.leftNeighbor;
    $scope.wonderOptions = [1, 2, 3];
    $scope.nonNeighbors = [];

    //a function to allow a players (first player in the room?) to initialize the game with the current number of players

    $scope.clearLocal = function() {
      localStorage.clear();
    }

    socket.on('connect', function(){
      console.log('I have made a persistent two-way connection to the server!');
      //need to initiate game when all players are ready (create a game in the db)
      socket.on('game initialized', function(data) {
        $state.go('playerView')
        // console.log('game started')
        $scope.players = data;
        // console.log('players', $scope.players)
        //find myself
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == socket.id) {
            $scope.me = $scope.players[i];
            $scope.minuses = [];
            $scope.pluses = 0;
            $scope.me.tokens.forEach(function(token) {
              if (token === -1) {
                $scope.minuses.push(token);
              } else {
                $scope.pluses += token;
              }
            });
        
          }
        }
        //find my neighbors (need to find myself first!)
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == $scope.me.neighborL && thisSocket !== socket.id) {
            $scope.leftNeighbor = $scope.players[i];
          } else if (thisSocket == $scope.me.neighborR && thisSocket !== socket.id) {
            $scope.rightNeighbor = $scope.players[i];
          } else if (thisSocket !== socket.id) {
            $scope.nonNeighbors = $scope.players[i];
          }
        }
        $scope.$digest()
      })

      socket.on('your hand', function(data) {
        $scope.myHand = data;
        $scope.$digest();
      })

      //{"left":null,"right":["ore"]}
      //{"left":null,"right":["papyrus"]}

      socket.on('your options', function(options) {
        $scope.playOptions = options;
        // $scope.playOptions.filter(function(option) {
        //   if (typeof option !== 'string') {
        //     var temp = 'Buy ';
        //     if (option.left) {
        //       option.left.forEach(function(resouce) {
        //         temp += resource;
        //         temp += ' and '
        //       })
        //       temp.slice
        //       temp += 'from left neighbor';
        //     }
        //     if (option.right)
        //   }
        //   if (option === 'Discard') {
        //     return option;
        //   } else if (option === 'get free') {
        //     return 'Build for free';
        //   } else if (option === 'pay money') {
        //     return "Pay 1 coin";
        //   } 
        //   if (option !== "no trade available!") {

        //   }
        // })
        $scope.$digest();
      })

      socket.on('err', function(data) {
        $scope.err = data.message;
        $scope.$digest();
      })

      //player submits their choice
      $scope.selectCard = function(card) {
        $scope.cardSelection = card;
	      socket.emit('choice made', {player: $scope.me.playerId, card: card.id});
      };

      $scope.dismiss = function() {
        $scope.err = null;
      }

      //waiting for other players


      //show all plays and update view


      //give player new cards


    });


//      $scope.builtCards = [
//        [ {image: 'img/3_arena_3.png'},
//          {image: 'img/3_garden_3.png'},
//          {image: 'img/3_haven_3.png'},
//          {image: 'img/3_arsenal_3.png'},
//          {image: 'img/3_palace_3.png'}
//        ],
//        [ {image: 'img/3_observatory_3.png'},
//          {image: 'img/3_pantheon_3.png'},
//          {image: 'img/3_study_3.png'},
//          {image: 'img/3_lodge_3.png'},
//          {image: 'img/3_fortifications_3.png'}
//        ]
//      ]


      $scope.clickedPile = false;

      $scope.expandPile = function (pile) {
        if (!$scope.clickedPile) $scope.clickedPile = pile;
        else $scope.clickedPile = false;
      }

});