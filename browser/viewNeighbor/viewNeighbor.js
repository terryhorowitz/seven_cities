app.directive('viewNeighbor', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {
            neighbor: '='
        },
        templateUrl: 'js/viewNeighbor/viewNeighbor.html'


    };

});
