app.directive('otherPlayers', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/other-players/other-players.html',
        link: function (scope) {

            scope.otherPlayers = [ { name: 'player 1'},
                { name: 'player 2'},
                { name: 'player 3'},
                { name: 'player 4'}
            ];

        }

    };

});
