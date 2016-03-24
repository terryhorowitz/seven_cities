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
    $scope.currentlyPlaying;
    $scope.me;
    $scope.myHand;
    $scope.rightNeighbor;
    $scope.leftNeighbor;

    //a function to allow a players (first player in the room?) to initialize the game with the current number of players
    $scope.startGame = function() {
    	socket.emit('startGame')
    }

    socket.on('connect', function(){
      console.log('I have made a persistent two-way connection to the server!');
      var tempId = localStorage.getItem('playerId');
      socket.emit('create', {roomname: $scope.roomname, playername: $scope.playername, localId: tempId});

      socket.on('your id', function(data) {
        localStorage.setItem('playerId', data.id)
      })

      socket.on('firstPlayer', function() {
      	$scope.firstPlayer = true;
      	$scope.$digest()
      })
      //need to initiate game when all players are ready (create a game in the db)
      socket.on('game initialized', function(data) {
        console.log('game started')
        $scope.players = data;
        console.log('players', $scope.players)
        for (var i = 0; i < data.length; i++) {
          if ($scope.players[i].name == $scope.playername) {
            $scope.me = $scope.players[i];
            if($scope.players[i+1]) {
              $scope.rightNeighbor = $scope.players[i+1];
              $scope.players.splice(i+1,1);
            } else {
              $scope.rightNeighbor = $scope.players[0];
              $scope.players.splice(0,1);
            }
            if($scope.players[i-1]) {
              $scope.leftNeighbor = $scope.players[i-1];
              $scope.players.splice(i-1,1);
            } else {
              $scope.leftNeighbor = $scope.players[$scope.players.length-1];
              $scope.players.splice($scope.players.length-1,1);
            }
            $scope.players.splice(i,1);
          }
        }
        console.log('players modified', $scope.players)
        $scope.$digest()
      })

      socket.on('your hand', function(data) {
        $scope.myHand = data;
        $scope.$digest();
      })

      //send all players their cards


      //player submits their choice
      $scope.playCard = function(card) {
	      socket.emit('choice made', card);
      };

      //waiting for other players


      //show all plays and update view


      //give player new cards


      // socket.on('game started', function(data) {
      //   if (counting === 0) {
      //     socket.emit('create initial', data);
      //     counting++;
      //   }
      //   $scope.origin = data.origin;
      //   $scope.goal = data.goal;
      //   $scope.curr = data.origin;
      //   $scope.waiting = false;
      //   $scope.getActorRoles($scope.origin)
      // });
      
      // socket.on('opponent result', function(data) {
      //   $scope.oppscore = data.degrees;
      //   $scope.oppath = data.path;
      //   $scope.$digest();
      // })
    });

      $scope.hand = [ {image: 'img/3_arena_3.png'},
        {image: 'img/3_garden_3.png'},
        {image: 'img/3_haven_3.png'},
        {image: 'img/3_arsenal_3.png'},
        {image: 'img/3_palace_3.png'}
      ]

      $scope.rawResources = [ {image: 'img/3_arena_3.png'},
        {image: 'img/3_garden_3.png'},
        {image: 'img/3_haven_3.png'},
        {image: 'img/3_arsenal_3.png'},
        {image: 'img/3_palace_3.png'}
      ];

      $scope.processedResources = [ {image: 'img/3_observatory_3.png'},
        {image: 'img/3_pantheon_3.png'},
        {image: 'img/3_study_3.png'},
        {image: 'img/3_lodge_3.png'},
        {image: 'img/3_fortifications_3.png'}
      ];

      $scope.builtCards = [
        [ {image: 'img/3_arena_3.png'},
          {image: 'img/3_garden_3.png'},
          {image: 'img/3_haven_3.png'},
          {image: 'img/3_arsenal_3.png'},
          {image: 'img/3_palace_3.png'}
        ],
        [ {image: 'img/3_observatory_3.png'},
          {image: 'img/3_pantheon_3.png'},
          {image: 'img/3_study_3.png'},
          {image: 'img/3_lodge_3.png'},
          {image: 'img/3_fortifications_3.png'}
        ]
      ]

      $scope.wonders = [
        {image: 'img/wonders/alexandria_1.png'},
        {image: 'img/wonders/alexandria_2.png'},
        {image: 'img/wonders/alexandria_3.png'}
      ]


        console.log($scope.wonders)

      $scope.clickedPile = false;

      $scope.expandPile = function (pile) {
        if (!$scope.clickedPile) $scope.clickedPile = pile;
        else $scope.clickedPile = false;
      }
});