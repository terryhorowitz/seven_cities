app.config(function ($stateProvider) {

    $stateProvider.state('playerView', {
        url: '/player-view',
        controller: 'PlayerViewController',
        templateUrl: 'js/player-view/player-view.html'
    });

});

app.controller('PlayerViewController', function ($scope, $state) {

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

	$scope.clickedCard = 0;
	// $scope.$event;

	$scope.expandCard = function (resource) {
		if ($scope.clickedCard === 0) $scope.clickedCard = resource;
		else $scope.clickedCard = 0;
	}

});