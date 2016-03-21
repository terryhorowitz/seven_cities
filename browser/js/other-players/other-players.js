app.directive('otherPlayers', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/other-players/other-players.html',
        link: function (scope) {

            scope.otherPlayers = [
                { label: 'Home', state: 'home' },
                { label: 'Game', state: 'game' },
                { label: 'About', state: 'about' },
                { label: 'Documentation', state: 'docs' }
            ];

        }

    };

});
