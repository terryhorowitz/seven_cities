app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'js/home/home.html'
    });
});



app.controller('HomeController', function ($scope, $state) {
    $scope.twoPlayer = function() {
      localStorage.clear();
    	$state.go('game', {roomname: $scope.chooseroomname, playername: $scope.choosename});
    }

    
});