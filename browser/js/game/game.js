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


    $scope.hand;
    $scope.firstPlayer = false;
    $scope.builtCards;
    $scope.players;
    $scope.money;
    $scope.currentlyPlaying;


    //a function to allow a players (first player in the room?) to initialize the game with the current number of players
    $scope.startGame = function() {
    	socket.emit('startGame')
    }

    socket.on('connect', function(){
      console.log('I have made a persistent two-way connection to the server!'); 
      socket.emit('create', {roomname: $scope.roomname, playername: $scope.playername});

      socket.on('firstPlayer', function() {
      	$scope.firstPlayer = true;
      	$scope.$digest()
      })
      //need to initiate game when all players are ready (create a game in the db)
      socket.on('game initialized', function(data) {
        $scope.players = data;
        $scope.$digest()
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
});