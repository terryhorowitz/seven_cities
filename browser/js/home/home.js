app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'js/home/home.html'
    });
});



app.controller('HomeController', function ($scope, $state) {
		// $scope.showinput = false;
  //   $scope.showin = function() {
  //   	$scope.showinput = true;
  //   }
    $scope.twoPlayer = function() {
    	$state.go('game', {roomname: $scope.chooseroomname, playername: $scope.choosename});
    }

    
});