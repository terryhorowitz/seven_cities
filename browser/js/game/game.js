app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('game', {
        url: '/game',
        params: {roomname: null, playername: null},
        controller: 'GameController',
        templateUrl: 'js/game/game.html'
    });

});

app.controller('GameController', function ($scope, $state) {

    var socket = io(window.location.origin); 
    $scope.roomname = $state.params.roomname;
    $scope.playername = $state.params.playername;

    $scope.firstPlayer = false;
    $scope.builtCards;
    $scope.players;
    $scope.money;
    $scope.currentlyPlaying = false;
    $scope.me;
    $scope.myHand;
    $scope.rightNeighbor;
    $scope.leftNeighbor;
    $scope.wonderOptions = [1, 2, 3];
    $scope.nonNeighbors = [];
    
    $scope.background = {background: 'url(/img/map.jpg) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};

    //a function to allow a players (first player in the room?) to initialize the game with the current number of players

    $scope.clearLocal = function() {
      localStorage.clear();
    }

    $scope.startGame = function() {
    	socket.emit('startGame')
    }

    socket.on('connect', function(){
      console.log('I have made a persistent two-way connection to the server!');
      var tempId = localStorage.getItem('playerId');
      socket.emit('create', {roomname: $scope.roomname, playername: $scope.playername, localId: tempId});

      socket.on('in room', function(data) {
        console.log('this is in room', data);
        $scope.inRoom = data.join(', ');
        $scope.$digest();
      })

      socket.on('your id', function(data) {
        $scope.me.playerId = data;
        localStorage.setItem('playerId', data)
      })

      socket.on('firstPlayer', function() {
      	$scope.firstPlayer = true;
      	$scope.$digest()
      })
      //need to initiate game when all players are ready (create a game in the db)
      socket.on('game initialized', function(data) {
        $scope.currentlyPlaying = true;
        // console.log('game started')
        $scope.players = data;
        console.log('players', $scope.players)
        //find myself
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == socket.id) {
            $scope.me = $scope.players[i];
            $scope.money = $scope.players[i].money;

            if ($scope.players[i].pluses) {
              $scope.pluses = $scope.players[i].pluses;
            } else {
              $scope.pluses = 0;
            }
            if ($scope.players[i].minuses) {
              $scope.minuses = $scope.players[i].minuses;
            } else {
              $scope.minuses = 0;
            }
        
          }
        }
        //find my neighbors (need to find myself first!)
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if ($scope.players[i].socket == $scope.me.neighborL && thisSocket !== socket.id) {
            $scope.leftNeighbor = $scope.players[i];
          } else if ($scope.players[i].socket == $scope.me.neighborR && thisSocket !== socket.id) {
            $scope.rightNeighbor = $scope.players[i];
          } else if (thisSocket !== socket.id) {
            $scope.nonNeighbors.push($scope.players[i]);
          }
        }

        // console.log('left', $scope.leftNeighbor, 'right', $scope.rightNeighbor, 'nonNeighbors', $scope.nonNeighbors)
        // console.log('me',$scope.me)
        $scope.background = {background: 'url(img/background/' + $scope.me.board.name + '.png) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};
            // console.log('backgd',$scope.background)

        $scope.$digest()
      })

      socket.on('your hand', function(data) {
        $scope.myHand = data;
        $scope.$digest();
      })

      //{"left":null,"right":["ore"]}
      //{"left":null,"right":["papyrus"]}

        $scope.submitChoice = function(selection){
          console.log('submission', selection)
          socket.emit('submit choice', {choice: selection, cardId: $scope.cardSelection.id, playerId: $scope.me.playerId});
          $scope.playOptions = null;
        }

      socket.on('your options', function(options) {
        $scope.playOptions = options;
        $scope.playOptions.forEach(function(option) {
          if (typeof option !== 'string') {
            var needed = [];
            if (option.left && option.left[0]) {
              needed.push({});
              needed[0].left = ['left'];
            }
            if (option.right && option.right[0]) {
              needed.push({});
              needed[0].right = ['right'];
            }
            console.log('this is playoptions', $scope.playOptions)
          } else if (option === 'Discard') {
            option = option;
          } else if (option === 'get free' || option === 'paid by own resources') {
            option = 'Build for free';
          } else if (option === 'pay money') {
            option = "Pay 1 coin";
          } else if (option === 'upgrade') {
            option = 'Upgrade for free'
          } else if (option === 'build wonder') {
            option = 'Build wonder';
          } else if (option !== "can't afford") {

          } else if (option !== "already have it") {

          } else if (option !== "no trade available!") {

          }
        })
        $scope.$digest();
      })

      socket.on('err', function(data) {
        $scope.err = data.message;
        $scope.$digest();
      })

      socket.on('new round', function(data) {
        $scope.players = data;

        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == socket.id) {
            $scope.me = $scope.players[i];
            $scope.money = $scope.me.money;
            $scope.pluses = $scope.players[i].pluses;
            $scope.minuses = $scope.players[i].minuses;
        
          }
        }

        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if ($scope.players[i].socket == $scope.me.neighborL && thisSocket !== socket.id) {
            $scope.leftNeighbor = $scope.players[i];
          } else if ($scope.players[i].socket == $scope.me.neighborR && thisSocket !== socket.id) {
            $scope.rightNeighbor = $scope.players[i];
          } else if (thisSocket !== socket.id) {
            $scope.nonNeighbors.push($scope.players[i]);
          }
        }
        console.log('this is players', $scope.players)

        $scope.$digest();
      })
      //player submits their choice
      $scope.selectCard = function(card) {
        $scope.cardSelection = card;
        socket.emit('choice made', {player: $scope.me.playerId, card: card.id});
      };

      $scope.dismiss = function() {
        $scope.err = null;
      };

      //waiting for other players


      //show all plays and update view


      //give player new cards


    });

      

      // $scope.builtCards = [
      //   [ {image: 'img/3_arena_3.png'},
      //     {image: 'img/3_garden_3.png'},
      //     {image: 'img/3_haven_3.png'},
      //     {image: 'img/3_arsenal_3.png'},
      //     {image: 'img/3_palace_3.png'}
      //   ],
      //   [ {image: 'img/3_observatory_3.png'},
      //     {image: 'img/3_pantheon_3.png'},
      //     {image: 'img/3_study_3.png'},
      //     {image: 'img/3_lodge_3.png'},
      //     {image: 'img/3_fortifications_3.png'}
      //   ]
      // ]

      // $scope.wonders = [
      //   {image: 'img/wonders/alexandria_1.png'},
      //   {image: 'img/wonders/alexandria_2.png'},
      //   {image: 'img/wonders/alexandria_3.png'}
      // ]


        // console.log($scope.wonders)

      $scope.clickedPile = false;

      $scope.expandPile = function (pile) {
        if (!$scope.clickedPile) $scope.clickedPile = pile;
        else $scope.clickedPile = false;
      }
});

